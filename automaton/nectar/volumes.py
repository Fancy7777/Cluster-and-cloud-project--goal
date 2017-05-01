import boto

from automaton.nectar import connection, config

conn = connection.establish()


def create_volume(size):
    """    
    :param size: in GiB

    :rtype: None or :class:`boto.ec2.volume.Volume`
    :return: None or The requested Volume object
    """

    placement = config.placement

    if placement is None or placement == '':
        print('Need to define the placement zone')
        return None
    else:
        try:
            zone = conn.get_all_zones(zones=placement)[0]
            vol_req = conn.create_volume(size, zone)
            vol_new = conn.get_all_volumes([vol_req.id])[0]
            msg = '{} is successfully created in {} zone and {} now.'.format(vol_new.id, vol_new.zone, vol_new.status)
            print(msg)
            return vol_new
        except boto.exception.EC2ResponseError as e:
            print('EC2ResponseError: [{}] {} '.format(e.error_code, e.error_message))
            return None


def delete_volume(vol_id):
    vol_list = conn.get_all_volumes(volume_ids=[vol_id])
    status = vol_list[0].status
    if status == 'available':
        return conn.delete_volume(volume_id=vol_id)
    else:
        print('Can not delete {}. Volume status is {}.'.format(vol_id, status))
        return False


def get_all():
    return conn.get_all_volumes()
