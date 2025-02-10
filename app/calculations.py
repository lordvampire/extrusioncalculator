import math
from app.models import Strangpressprofil, Extrusionsanlage

ALUMINIUM_DICHTE = 0.0027  # g/mm³

def validate_inputs(profile: Strangpressprofil, anlage: Extrusionsanlage):
    if not isinstance(profile, Strangpressprofil):
        raise ValueError("Invalid profile instance")
    if not isinstance(anlage, Extrusionsanlage):
        raise ValueError("Invalid anlage instance")
    if profile.profilgewicht <= 0:
        raise ValueError("Invalid profile weight")
    if anlage.containerdurchmesser <= 0:
        raise ValueError("Invalid container diameter")
    if anlage.max_stempelgeschwindigkeit <= 0:
        raise ValueError("Invalid max stempelgeschwindigkeit")
    if not (1 <= profile.profilkomplexitaet <= 10):
        raise ValueError("Invalid profile complexity")
    if profile.profiltyp not in ["flach", "hohl"]:
        raise ValueError("Invalid profile type")
    if not (0 <= anlage.rampenverlust <= 100):
        raise ValueError("Invalid rampenverlust")

def calculate_verpressungsverhaeltnis(profile: Strangpressprofil, anlage: Extrusionsanlage) -> float:
    validate_inputs(profile, anlage)
    container_radius = anlage.containerdurchmesser / 2
    container_area = math.pi * (container_radius ** 2)
    gewicht_container_m = container_area * 1000 * ALUMINIUM_DICHTE
    verpressungsverhaeltnis = gewicht_container_m / profile.profilgewicht

    return round(max(1.0, verpressungsverhaeltnis), 2)

def calculate_max_theor_profgesch(profile: Strangpressprofil, anlage: Extrusionsanlage) -> float:
    validate_inputs(profile, anlage)
    verpressungsverhaeltnis = calculate_verpressungsverhaeltnis(profile, anlage)
    max_theor_profgesch_mm_s = anlage.max_stempelgeschwindigkeit / verpressungsverhaeltnis

    return round(max(1.0, max_theor_profgesch_mm_s * 0.06), 2)

def calculate_profgesch(profile: Strangpressprofil, anlage: Extrusionsanlage,
                        oberflaechenfaktor: float, anwendungsfaktor: float) -> float:
    validate_inputs(profile, anlage)
    max_theor_profgesch = calculate_max_theor_profgesch(profile, anlage)
    komplexitaetsfaktor = 1 - (profile.profilkomplexitaet - 1) * 0.05
    profiltyp_faktor = 1.0 if profile.profiltyp == "flach" else 0.7
    profgesch = (max_theor_profgesch * oberflaechenfaktor * anwendungsfaktor *
                 komplexitaetsfaktor * profiltyp_faktor * (1 - anlage.rampenverlust / 100))

    return round(max(1.0, profgesch), 2)

def calculate_austrittsgewicht(profile: Strangpressprofil, anlage: Extrusionsanlage) -> float:
    validate_inputs(profile, anlage)
    austrittsgewicht = profile.profilgewicht * profile.strangzahl

    return round(austrittsgewicht, 2)

def calculate_max_auszug(profile: Strangpressprofil, anlage: Extrusionsanlage) -> float:
    validate_inputs(profile, anlage)
    verpressungsverhaeltnis = calculate_verpressungsverhaeltnis(profile, anlage)
    max_auszug = anlage.max_bolzenlaenge * verpressungsverhaeltnis

    return round(max_auszug, 2)

def calculate_kundenlaengen_pro_runout(profile: Strangpressprofil, anlage: Extrusionsanlage) -> int:
    validate_inputs(profile, anlage)
    max_auszug = calculate_max_auszug(profile, anlage)
    effektive_auszug = min(max_auszug, anlage.max_auszugslaenge) - profile.schrottlaenge
    kundenlaengen_pro_runout = effektive_auszug / profile.kundenlaenge

    return math.floor(kundenlaengen_pro_runout)

def calculate_optimal_bolzenlaenge(profile: Strangpressprofil, anlage: Extrusionsanlage) -> float:
    validate_inputs(profile, anlage)
    verpressungsverhaeltnis = calculate_verpressungsverhaeltnis(profile, anlage)
    max_auszug = min(calculate_max_auszug(profile, anlage), anlage.max_auszugslaenge)
    effektive_auszug = max_auszug - anlage.schrottlaenge
    kundenlaengen_pro_runout = math.floor(effektive_auszug / profile.kundenlaenge)
    optimale_bolzenlaenge = (kundenlaengen_pro_runout * profile.kundenlaenge + anlage.schrottlaenge) / verpressungsverhaeltnis

    return round(optimale_bolzenlaenge, 2)

def calculate_productivity(profile: Strangpressprofil, anlage: Extrusionsanlage,
                           oberflaechenfaktor: float, anwendungsfaktor: float) -> float:
    validate_inputs(profile, anlage)
    optimale_bolzenlaenge = calculate_optimal_bolzenlaenge(profile, anlage)
    profgesch = calculate_profgesch(profile, anlage, oberflaechenfaktor, anwendungsfaktor)
    profgesch_mm_s = profgesch * 1000 / 60  # Umrechnung von m/min in mm/s
    stempelgeschwindigkeit = profgesch_mm_s / calculate_verpressungsverhaeltnis(profile, anlage)
    verpressungszeit = optimale_bolzenlaenge / stempelgeschwindigkeit
    gesamtzeit = verpressungszeit + anlage.totzeit
    gutmenge = (optimale_bolzenlaenge - profile.schrottlaenge) * profile.profilgewicht
    produktivitaet = (gutmenge / gesamtzeit) * 3600  # Umrechnung in kg/h

    return round(produktivitaet, 2)