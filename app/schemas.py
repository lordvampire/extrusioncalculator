from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class OberflaechenanforderungSchema(BaseModel):
    id: Optional[str] = None
    bezeichnung: str
    reduktionsfaktor: float

    class Config:
        from_attributes = True

class AnwendungsbereichSchema(BaseModel):
    id: Optional[str] = None
    bezeichnung: str
    reduktionsfaktor: float
    schrottlaenge: float

    class Config:
        from_attributes = True

class ExtrusionsanlageSchema(BaseModel):
    id: Optional[str] = None
    name: str
    bolzendurchmesser: float
    containerdurchmesser: float
    max_bolzenlaenge: float
    max_auszugslaenge: float
    max_stempelgeschwindigkeit: float
    max_profilbreite: float
    totzeit: float
    max_pullergeschwindigkeit: float
    max_strangzahl: int
    rampenverlust: float

class Config:
    from_attributes = True

class StrangpressprofilSchema(BaseModel):
    profilbreite: float
    profilhoehe: float
    profilgewicht: float
    profiltyp: str
    profilkomplexitaet: int
    strangzahl: int
    schrottlaenge: float
    kundenlaenge: float
    anwendungsbereich_id: Optional[UUID]
    oberflaechenanforderung_id: Optional[UUID]

class Config:
    from_attributes = True
