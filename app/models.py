from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

class Oberflaechenanforderung(Base):
    __tablename__ = "oberflaechenanforderungen"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bezeichnung = Column(String, nullable=False)
    reduktionsfaktor = Column(Float, nullable=False)

class Anwendungsbereich(Base):
    __tablename__ = "anwendungsbereiche"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bezeichnung = Column(String, nullable=False)
    reduktionsfaktor = Column(Float, nullable=False)
    schrottlaenge = Column(Float, nullable=False)

class Extrusionsanlage(Base):
    __tablename__ = "extrusionsanlagen"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    bolzendurchmesser = Column(Float, nullable=False)
    containerdurchmesser = Column(Float, nullable=False)
    max_bolzenlaenge = Column(Float, nullable=False)
    max_auszugslaenge = Column(Float, nullable=False)
    max_stempelgeschwindigkeit = Column(Float, nullable=False)
    max_profilbreite = Column(Float, nullable=False)
    totzeit = Column(Float, nullable=False)
    max_pullergeschwindigkeit = Column(Float, nullable=False)
    max_strangzahl = Column(Integer, nullable=False)
    rampenverlust = Column(Float, nullable=False)  # Hinzugefügt

class Strangpressprofil(Base):
    __tablename__ = "strangpressprofile"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profilbreite = Column(Float, nullable=False)
    profilhoehe = Column(Float, nullable=False)
    profilgewicht = Column(Float, nullable=False)
    profiltyp = Column(String, nullable=False)
    profilkomplexitaet = Column(Integer, nullable=False)
    zugfestigkeit = Column(Float, nullable=False)
    kundenlaenge = Column(Float, nullable=False)
    anwendungsbereich_id = Column(UUID(as_uuid=True), ForeignKey("anwendungsbereiche.id"))
    oberflaechenanforderung_id = Column(UUID(as_uuid=True), ForeignKey("oberflaechenanforderungen.id"))
