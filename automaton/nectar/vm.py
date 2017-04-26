import time

import boto

from automaton.nectar import connection, config

conn = connection.establish()

my_instances = set()


def create_server(count):
    if count is None or count < 1:
        count = 1

    try:
        print('Creating instances....')

        placement = config.placement
        if placement == '':
            placement = None

        new_reservation = conn.run_instances(
            config.default_image_id,
            max_count=count,
            key_name=config.default_key_name,
            instance_type=config.default_instance_type,
            security_groups=config.default_security_groups,
            placement=placement)

        new_instance = new_reservation.instances[0]

        while new_instance.state == u'pending':
            print('Creating status: {}'.format(new_instance.state))
            time.sleep(10)
            new_instance.update()

        print('Done.')
        show_instances(new_reservation)

    except boto.exception.EC2ResponseError as e:
        print('EC2ResponseError: [{}] {} '.format(e.error_code, e.error_message))


def show_instances(reservation):
    print('Reservation {} has {} instances.'.format(reservation.id, len(reservation.instances)))
    # NOTE: The ip_address return None on Nectar but private_ip_address return the public IP.
    for inst in reservation.instances:
        # print(inst.__dict__)  # dump all
        print('\t{} {} {} {}'.format(inst.id, inst.private_ip_address, inst.placement, inst.state))
        my_instances.add(inst.id)


def show_reservations_and_instances():
    reservations = conn.get_all_reservations()
    if len(reservations) < 1:
        print('You have no instances provisioned.')
    else:
        for res in reservations:
            show_instances(res)
