from automaton.nectar import connection

conn = connection.establish()


def get_all():
    return conn.get_all_zones()


def get_by_name_list(zone_names):
    return conn.get_all_zones(zones=zone_names)


def get_by_filter(filter_dict):
    return conn.get_all_zones(filters=filter_dict)


def get_by_name(zone_name):
    return conn.get_all_zones(zones=zone_name)[0]
