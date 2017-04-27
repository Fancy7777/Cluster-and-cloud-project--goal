import boto

from automaton.nectar import connection

conn = connection.establish()

PUBLIC = '0.0.0.0/0'


# TODO: handle Exceptions


def create_security_group(name, description):
    return conn.create_security_group(name, description)


def delete_security_group(name):
    return conn.delete_security_group(name)


def get_all_security_groups():
    return conn.get_all_security_groups()


def get_security_group(name):
    return conn.get_all_security_groups(groupnames=name)[0]


def open_tcp_port(port, name):
    return open_tcp_port_range(port, port, name)


def open_tcp_port_range(start_port, end_port, name):
    try:
        grp = get_security_group(name)
        return grp.authorize('tcp', start_port, end_port, PUBLIC)
    except boto.exception.EC2ResponseError as e:
        print('EC2ResponseError: [{}] {} '.format(e.error_code, e.error_message))


def allow_tcp_connection_from(port, name, ip):
    return allow_tcp_connection_range_from(port, port, name, ip)


def allow_tcp_connection_range_from(start_port, end_port, name, ip):
    grp = get_security_group(name)
    return grp.authorize('tcp', start_port, end_port, ip)


def get_firewall_rules(name):
    grp = get_security_group(name)
    return grp.rules
