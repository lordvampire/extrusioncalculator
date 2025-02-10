from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Oberflaechenanforderung, Anwendungsbereich, Extrusionsanlage, Strangpressprofil
from app.calculations import (
    calculate_verpressungsverhaeltnis,
    calculate_max_theor_profgesch,
    calculate_profgesch,
    calculate_austrittsgewicht,
    calculate_max_auszug,
    calculate_kundenlaengen_pro_runout,
    calculate_optimal_bolzenlaenge,
    calculate_productivity
)
from app.schemas import (
    OberflaechenanforderungSchema,
    AnwendungsbereichSchema,
    ExtrusionsanlageSchema,
    StrangpressprofilSchema
)
import uuid

router = APIRouter()

# Strangpressprofil-Endpunkte
@router.get("/profile", response_model=list[StrangpressprofilSchema])
def get_profiles(db: Session = Depends(get_db)):
    return db.query(Strangpressprofil).all()

@router.post("/profile", response_model=StrangpressprofilSchema)
def create_profile(profile: StrangpressprofilSchema, db: Session = Depends(get_db)):
    new_profile = Strangpressprofil(**profile.model_dump(), id=uuid.uuid4())
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@router.get("/extrusionsanlagen", response_model=list[ExtrusionsanlageSchema])
def get_anlagen(db: Session = Depends(get_db)):
    anlagen = db.query(Extrusionsanlage).all()

    # ✅ UUID zu String umwandeln
    for anlage in anlagen:
        anlage.id = str(anlage.id)

        # ✅ Falls ein Wert `None` ist, mit `0.0` oder einem Standardwert ersetzen
        if anlage.max_bolzenlaenge is None:
            anlage.max_bolzenlaenge = 0.0
        if anlage.max_auszugslaenge is None:
            anlage.max_auszugslaenge = 0.0
        if anlage.max_stempelgeschwindigkeit is None:
            anlage.max_stempelgeschwindigkeit = 0.0
        if anlage.max_pullergeschwindigkeit is None:
            anlage.max_pullergeschwindigkeit = 0.0

    return anlagen

@router.post("/extrusionsanlagen", response_model=ExtrusionsanlageSchema)
def create_anlage(anlage: ExtrusionsanlageSchema, db: Session = Depends(get_db)):
    anlage_data = anlage.model_dump()

    if "id" not in anlage_data or anlage_data["id"] is None:
        anlage_data["id"] = str(uuid.uuid4())  # UUID in String umwandeln

    new_anlage = Extrusionsanlage(**anlage_data)
    db.add(new_anlage)
    db.commit()
    db.refresh(new_anlage)

    # ✅ UUID zu String konvertieren
    new_anlage.id = str(new_anlage.id)

    return new_anlage

@router.delete("/extrusionsanlagen/{anlage_id}")
def delete_anlage(anlage_id: uuid.UUID, db: Session = Depends(get_db)):
    anlage = db.query(Extrusionsanlage).filter(Extrusionsanlage.id == anlage_id).first()

    if not anlage:
        raise HTTPException(status_code=404, detail="Extrusionsanlage nicht gefunden")

    db.delete(anlage)
    db.commit()

    return {"message": "Extrusionsanlage erfolgreich gelöscht", "id": str(anlage_id)}

# Berechnungs-Endpunkt
@router.post("/api/calculate")
def calculate(profile: StrangpressprofilSchema, db: Session = Depends(get_db)):
    anlagen = db.query(Extrusionsanlage).all()
    results = []
    for anlage in anlagen:
        anlage_dict = anlage.__dict__.copy()
        anlage_dict['id'] = str(anlage_dict['id'])  # UUID zu String umwandeln
        anlage_schema = ExtrusionsanlageSchema(**anlage_dict)
        result = {
            "verpressungsverhaeltnis": calculate_verpressungsverhaeltnis(profile, anlage_schema),
            "max_theor_profgesch": calculate_max_theor_profgesch(profile, anlage_schema),
            "profgesch": calculate_profgesch(profile, anlage_schema, 1.0, 1.0),  # Beispielwerte für oberflaechenfaktor und anwendungsfaktor
            "austrittsgewicht": calculate_austrittsgewicht(profile, anlage_schema),
            "max_auszug": calculate_max_auszug(profile, anlage_schema),
            "kundenlaengen_pro_runout": calculate_kundenlaengen_pro_runout(profile, anlage_schema),
            "optimal_bolzenlaenge": calculate_optimal_bolzenlaenge(profile, anlage_schema),
            "productivity": calculate_productivity(profile, anlage_schema, 1.0, 1.0)  # Beispielwerte für oberflaechenfaktor und anwendungsfaktor
        }
        results.append(result)
    return results

@router.post("/oberflaechen", response_model=OberflaechenanforderungSchema)
def create_oberflaeche(oberflaeche: OberflaechenanforderungSchema, db: Session = Depends(get_db)):
    oberflaeche_data = oberflaeche.model_dump()

    if "id" not in oberflaeche_data or oberflaeche_data["id"] is None:
        oberflaeche_data["id"] = str(uuid.uuid4())  # UUID in String umwandeln

    new_oberflaeche = Oberflaechenanforderung(**oberflaeche_data)
    db.add(new_oberflaeche)
    db.commit()
    db.refresh(new_oberflaeche)

    # ✅ UUID zu String konvertieren
    new_oberflaeche.id = str(new_oberflaeche.id)

    return new_oberflaeche

@router.get("/oberflaechen", response_model=list[OberflaechenanforderungSchema])
def get_oberflaechen(db: Session = Depends(get_db)):
    results = db.query(Oberflaechenanforderung).all()

    # ✅ UUIDs explizit in Strings umwandeln
    for result in results:
        result.id = str(result.id)

    return results

@router.put("/oberflaechen/{oberflaeche_id}", response_model=OberflaechenanforderungSchema)
def update_oberflaeche(oberflaeche_id: uuid.UUID, oberflaeche: OberflaechenanforderungSchema, db: Session = Depends(get_db)):
    db_oberflaeche = db.query(Oberflaechenanforderung).filter(Oberflaechenanforderung.id == oberflaeche_id).first()
    if not db_oberflaeche:
        raise HTTPException(status_code=404, detail="Oberflächenanforderung nicht gefunden")
    for key, value in oberflaeche.model_dump().items():
        setattr(db_oberflaeche, key, value)
    db.commit()
    db.refresh(db_oberflaeche)
    return db_oberflaeche

@router.delete("/oberflaechen/{oberflaeche_id}", response_model=dict)
def delete_oberflaeche(oberflaeche_id: uuid.UUID, db: Session = Depends(get_db)):
    db_oberflaeche = db.query(Oberflaechenanforderung).filter(Oberflaechenanforderung.id == oberflaeche_id).first()
    if not db_oberflaeche:
        raise HTTPException(status_code=404, detail="Oberflächenanforderung nicht gefunden")
    db.delete(db_oberflaeche)
    db.commit()
    return {"message": "Oberflächenanforderung erfolgreich gelöscht"}

@router.get("/anwendungsbereiche", response_model=list[AnwendungsbereichSchema])
def get_anwendungsbereiche(db: Session = Depends(get_db)):
    results = db.query(Anwendungsbereich).all()

    # ✅ UUIDs explizit in Strings umwandeln
    for result in results:
        result.id = str(result.id)

    return results

@router.post("/anwendungsbereiche", response_model=AnwendungsbereichSchema)
def create_anwendungsbereich(anwendungsbereich: AnwendungsbereichSchema, db: Session = Depends(get_db)):
    anwendungsbereich_data = anwendungsbereich.model_dump()

    # ✅ UUID nur setzen, wenn nicht vorhanden
    if "id" not in anwendungsbereich_data or anwendungsbereich_data["id"] is None:
        anwendungsbereich_data["id"] = str(uuid.uuid4())

    new_anwendungsbereich = Anwendungsbereich(**anwendungsbereich_data)
    db.add(new_anwendungsbereich)
    db.commit()
    db.refresh(new_anwendungsbereich)

    # ✅ UUID zu String konvertieren
    new_anwendungsbereich.id = str(new_anwendungsbereich.id)

    return new_anwendungsbereich

@router.put("/anwendungsbereiche/{anwendungsbereich_id}", response_model=AnwendungsbereichSchema)
def update_anwendungsbereich(anwendungsbereich_id: uuid.UUID, anwendungsbereich: AnwendungsbereichSchema, db: Session = Depends(get_db)):
    db_anwendungsbereich = db.query(Anwendungsbereich).filter(Anwendungsbereich.id == anwendungsbereich_id).first()
    if not db_anwendungsbereich:
        raise HTTPException(status_code=404, detail="Anwendungsbereich nicht gefunden")
    for key, value in anwendungsbereich.model_dump().items():
        setattr(db_anwendungsbereich, key, value)
    db.commit()
    db.refresh(db_anwendungsbereich)
    return db_anwendungsbereich

@router.delete("/anwendungsbereiche/{anwendungsbereich_id}", response_model=dict)
def delete_anwendungsbereich(anwendungsbereich_id: uuid.UUID, db: Session = Depends(get_db)):
    db_anwendungsbereich = db.query(Anwendungsbereich).filter(Anwendungsbereich.id == anwendungsbereich_id).first()
    if not db_anwendungsbereich:
        raise HTTPException(status_code=404, detail="Anwendungsbereich nicht gefunden")
    db.delete(db_anwendungsbereich)
    db.commit()
    return {"message": "Anwendungsbereich erfolgreich gelöscht"}
