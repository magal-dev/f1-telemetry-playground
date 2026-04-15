import fastf1

fastf1.Cache.enable_cache("cache")

session = fastf1.get_session(2023, "Monza","Q")

session.load()

leclerc_laps = session.laps.pick_drivers('LEC')
fastest_lec_lap = leclerc_laps.pick_fastest()
lec_data = fastest_lec_lap.get_car_data().add_distance()
print("LEC max speed: ", lec_data["Speed"].max())
print("LEC fastest lap: ", fastest_lec_lap["LapTime"])

verstappen_laps = session.laps.pick_drivers('VER')
fastest_ver_lap = verstappen_laps.pick_fastest()
ver_data = fastest_ver_lap.get_car_data().add_distance()
print("VER max speed: ", ver_data["Speed"].max())
print("VER fastest lap: ", fastest_ver_lap["LapTime"])