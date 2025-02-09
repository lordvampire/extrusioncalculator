import math
from app.models import Strangpressprofil, Extrusionsanlage

ALUMINIUM_DICHTE = 0.0027  # g/mm³

def calculate_verpressungsverhaeltnis(profile: Strangpressprofil, anlage: Extrusionsanlage) -> float:
    container_radius = anlage.containerdurchmesser / 2
    container_area = math.pi * (container_radius ** 2)
    gewicht_container_m = container_area * 1000 * ALUMINIUM_DICHTE
    verpressungsverhaeltnis = gewicht_container_m / profile.profilgewicht

    # ✅ Auf zwei Nachkommastellen runden
    return round(max(1.0, verpressungsverhaeltnis), 2)


def calculate_max_theor_profgesch(profile: Strangpressprofil, anlage: Extrusionsanlage) -> float:
    verpressungsverhaeltnis = calculate_verpressungsverhaeltnis(profile, anlage)
    max_theor_profgesch_mm_s = anlage.max_stempelgeschwindigkeit / verpressungsverhaeltnis

    # ✅ Umrechnung von mm/s in m/min
    return round(max(1.0, max_theor_profgesch_mm_s * 0.06), 2)

def calculate_profgesch(profile: Strangpressprofil, anlage: Extrusionsanlage,
                        oberflaechenfaktor: float, anwendungsfaktor: float) -> float:
    max_theor_profgesch = calculate_max_theor_profgesch(profile, anlage)

    # ✅ Komplexitätsfaktor berechnen (linear zwischen 1.0 und 0.5)
    komplexitaetsfaktor = 1 - (profile.profilkomplexitaet - 1) * 0.05

    # ✅ Profiltyp-Faktor setzen (flach = 1.0, hohl = 0.7)
    profiltyp_faktor = 1.0 if profile.profiltyp == "flach" else 0.7

    # ✅ Anwendung aller Reduktionsfaktoren
    profgesch = (max_theor_profgesch * oberflaechenfaktor * anwendungsfaktor *
                 komplexitaetsfaktor * profiltyp_faktor * (1 - anlage.rampenverlust / 100))

    # ✅ Ergebnis auf zwei Nachkommastellen runden
    return round(max(1.0, profgesch), 2)
