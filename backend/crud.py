from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from models import User, ConferenceRegistration, Speaker, AgendaItem
from schemas import UserCreate, ConferenceRegistration as ConferenceRegistrationSchema, SpeakerCreate, AgendaItem as AgendaItemSchema

# User CRUD
def create_user(db: Session, user: UserCreate):
    hashed_password = bcrypt.hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        company=user.company,
        position=user.position
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# Conference Registration CRUD
def create_registration(db: Session, registration: ConferenceRegistrationSchema):
    db_registration = ConferenceRegistration(
        first_name=registration.first_name,
        last_name=registration.last_name,
        email=registration.email,
        company=registration.company,
        position=registration.position,
        phone=registration.phone,
        track=registration.track,
        dietary=registration.dietary,
        agree_terms=registration.agree_terms,
        agree_marketing=registration.agree_marketing
    )
    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)
    return db_registration

def get_registrations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ConferenceRegistration).offset(skip).limit(limit).all()

def get_registration(db: Session, registration_id: int):
    return db.query(ConferenceRegistration).filter(ConferenceRegistration.id == registration_id).first()

# Speaker CRUD
def create_speaker(db: Session, speaker: SpeakerCreate):
    db_speaker = Speaker(
        name=speaker.name,
        title=speaker.title,
        company=speaker.company,
        bio=speaker.bio,
        topic=speaker.topic,
        track=speaker.track,
        image_url=speaker.image_url
    )
    db.add(db_speaker)
    db.commit()
    db.refresh(db_speaker)
    return db_speaker

def get_speakers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Speaker).offset(skip).limit(limit).all()

def get_speaker(db: Session, speaker_id: int):
    return db.query(Speaker).filter(Speaker.id == speaker_id).first()

# Agenda CRUD
def create_agenda_item(db: Session, agenda_item: AgendaItemSchema):
    db_agenda_item = AgendaItem(
        day=agenda_item.day,
        time=agenda_item.time,
        title=agenda_item.title,
        speaker=agenda_item.speaker,
        track=agenda_item.track,
        type=agenda_item.type,
        description=agenda_item.description
    )
    db.add(db_agenda_item)
    db.commit()
    db.refresh(db_agenda_item)
    return db_agenda_item

def get_agenda_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AgendaItem).offset(skip).limit(limit).all()

def get_agenda_item(db: Session, agenda_item_id: int):
    return db.query(AgendaItem).filter(AgendaItem.id == agenda_item_id).first()

def get_agenda_by_day(db: Session, day: str):
    return db.query(AgendaItem).filter(AgendaItem.day == day).all() 