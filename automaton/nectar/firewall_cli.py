from automaton.nectar import firewall
from automaton.nectar.firewall import conn


def main():
    # ---------------
    # print_heading('Firewall')
    uin = input('Create new security group? (y or n): ')
    sec_grp_name = 'couchdb'
    if uin == 'y':
        uin = input('Enter name for security group ({}): '.format(sec_grp_name))
        if uin is not None and uin != '':
            sec_grp_name = uin
        sec_grp = None
        for grp in firewall.get_all_security_groups():
            if grp.name == sec_grp_name:
                sec_grp = grp

        if sec_grp is None:
            uin = input('Enter ports to open: ')
            ports = []
            for i in uin.split():
                try:
                    port = int(i)
                    if port not in range(1, 65535):
                        # print_invalid_exit()
                        exit()
                    ports.append(port)
                except ValueError:
                    # print_invalid_exit()
                    exit()

            if len(ports) < 1:
                # print_invalid_exit()
                exit()

            print('Creating security group {} with opening ports {}'
                  .format(sec_grp_name, ports))
            firewall.create_security_group(sec_grp_name, 'Open ports {}'.format(ports))
            for p in ports:
                firewall.open_tcp_port(p, sec_grp_name)

        sec_grp_ids = [str(sec_grp.id)]
        # print(CHECKED + 'Applying security group id {} to instances {}.'.format(sec_grp_ids, selected_ix))
        # for ix in selected_ix:
            # ix.modify_attribute(attribute='groupSet', value=sec_grp_ids)
            # conn.modify_instance_attribute(ix.id, attribute='groupSet', value=sec_grp_ids)
        conn.authorize_security_group('default', sec_grp.name, sec_grp.owner_id)

    # print_footer()


if __name__ == '__main__':
    main()
