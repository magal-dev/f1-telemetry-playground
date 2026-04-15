from fastapi import FastAPI
from app.services.telemetry import get_fastest_lap
from app.services.telemetry import compare_drivers

app = FastAPI()

@app.get("/")
def root():
    return {"message": "F1 Telemetry API is running!"}

@app.get("/fastest_lap")
def fastest_lap(year: int, race :str, driver :str):
    return {"driver": driver, "data": get_fastest_lap(year, race, driver)}

@app.get("/compare_drivers")
def compare(year :int, race :str, driver1 :str, driver2 :str):
    data = compare_drivers(year, race, driver1, driver2)
    return {
        "driver1": driver1,
        "driver2": driver2,
        "race": race,
        "year": year,
        "data": data
    }