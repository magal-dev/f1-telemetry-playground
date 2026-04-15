import fastf1

fastf1.Cache.enable_cache("cache")

def get_fastest_lap(year :int, race :str, driver :str):
    session = fastf1.get_session(year, race, "Q")
    session.load()

    driver_laps = session.laps.pick_drivers(driver)
    fastest_lap = driver_laps.pick_fastest()

    car_data = fastest_lap.get_car_data().add_distance()

    return car_data.to_dict(orient="records")

def compare_drivers(year :int, race :str, driver1 :str, driver2 :str):
    session = fastf1.get_session(year, race, "Q")
    session.load()

    d1_laps = session.laps.pick_drivers(driver1)
    d2_laps = session.laps.pick_drivers(driver2)

    d1_car_data = d1_laps.get_car_data().add_distance()
    d2_car_data = d2_laps.get_car_data().add_distance()

    return {
        "driver1": d1_car_data.to_dict("records"),
        "driver2": d2_car_data.to_dict("records")
    }