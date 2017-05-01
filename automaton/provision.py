import configparser
import os
import platform
import shlex
import subprocess
import time
from os.path import expanduser

import colorama
import re
from colorama import Style, Fore, Back

from automaton.nectar import vm, config, firewall, volumes

conn = vm.conn
parser = configparser.ConfigParser(allow_no_value=True, delimiters=' ')

CHECKED = '[ ' + Fore.GREEN + 'check' + Fore.RESET + ' ]  '
FAILED = '[ ' + Fore.RED + 'fail' + Fore.RESET + ' ]  '


def print_heading(heading):
    print('# --------------- ' + Fore.YELLOW + '{}'.format(heading.upper()) + Fore.RESET)


def print_footer():
    print('')


def print_invalid_exit():
    print(Fore.RED + 'Invalid choice. Halt!'.upper())
    exit()


def abort():
    print(Fore.RED + 'Abort!'.upper())
    exit()


def ssh_known_hosts(ip):
    cmd = 'ssh-keyscan -4 -t rsa ' + ip
    print(CHECKED + 'Scanning host :\t ' + cmd)

    out = subprocess.check_output(shlex.split(cmd), universal_newlines=True)

    if len(out) == 0:
        print('[Abort] Not able to connect  {}'.upper().format(ip))
        exit()

    # print(str(out).rstrip())

    known_host = expanduser('~/.ssh/known_hosts')
    with open(known_host, 'r+') as f:
        lines = f.readlines()
        f.seek(0)
        append_new = True
        for line in lines:
            if ip in line and line != out:
                # detected existing entry
                # and not equal, update require. replace it.
                print('Updating known host:  {}.'.format(ip))
                f.write(out)
                append_new = False
            else:
                # no update require or other entries
                f.write(line)
                if ip in line:
                    append_new = False
        if append_new:
            print(CHECKED + 'Added new known host:  {}.'.format(ip))
            f.write(out)
        f.truncate()
        f.close()


def countdown(t):
    while t + 1:
        minute, second = divmod(t, 60)
        time_format = '{:02d}:{:02d}'.format(minute, second)
        print(Fore.CYAN + Style.BRIGHT + time_format + Style.RESET_ALL + Fore.RESET, end='\r')
        time.sleep(1)
        t -= 1


def main():
    # ---------------
    print_heading('Current Provision')
    vm.show_reservations_and_instances()
    print_footer()

    # ---------------
    print_heading('New Provision')
    uin = input('Create new instances? (y or n): ')
    cnt = 0
    if uin == 'y':
        try:
            cnt = int(input('How many new instances require? (1-50): '))
            if cnt in range(1, 50):
                uin = input('Create {} new instances? (y or n): '.format(cnt))
                if uin == 'y':
                    vm.create_server(cnt)
                elif uin != 'n':
                    print_invalid_exit()
            else:
                print_invalid_exit()
        except ValueError:
            print_invalid_exit()
    else:
        pass

    instances = conn.get_only_instances()
    total_instances = len(instances)
    if total_instances < cnt:
        print('Not enough resource available.')
        exit(0)
    print_footer()

    # ---------------
    print_heading('Available Resources')
    for idx, inst in enumerate(instances):
        print('{}:\t{}\t{}\t{}\t{}'.format(idx, inst.id, inst.private_ip_address, inst.state, inst.placement))

    print('')
    uin = input('Pick instances (a or 0 1 3): ')

    selected_ix = []
    if uin != 'a':
        for i in uin.split():
            try:
                ix = int(i)
                if ix not in range(0, total_instances):
                    print_invalid_exit()
                selected_ix.append(instances[ix])
            except ValueError:
                print_invalid_exit()
    else:
        selected_ix = instances
    if len(selected_ix) < 1:
        selected_ix = instances
    print(CHECKED + 'Selected {}'.format(selected_ix))
    print_footer()

    # ---------------
    print_heading('Preflight Check')
    for ix in selected_ix:
        if ix.state != u'running':
            uin = input('Instance {} is {}. Start it? (y or n): '.format(ix.id, ix.state))
            if uin == 'y':
                print('Starting instance {}...'.format(ix.id))
                conn.start_instances(ix.id)
                while ix.state == u'stopped':
                    print('.', end='', flush=True)
                    time.sleep(0.5)
                    ix.update()
                print('\nInstance {} is now {}.'.format(ix.id, ix.state))
            else:
                print('[Abort] Not able to start  {}'.upper().format(ix.private_ip_address))
                exit()

    server_group = 'couchdbs'
    uin = input('Give provision name for server group ({}): '.format(server_group))
    if uin is not None and uin != '':
        server_group = uin
    print(CHECKED + server_group)
    parser[server_group] = dict((ix.private_ip_address, '') for ix in selected_ix)

    host_file = 'hosts.ini'
    uin = input('Give name for host file ({}): '.format(host_file))
    if uin is not None and uin != '':
        host_file = uin
    print(CHECKED + host_file)
    print('Writing host file... ' + Fore.GREEN + '{}'.format(host_file) + Fore.RESET)
    with open(host_file, 'w') as f:
        parser.write(f)
    print_footer()

    # ---------------
    print_heading('Firewall')
    uin = input('Open ports? (y or n): ')
    if uin == 'y':
        sec_groups = firewall.get_all_security_groups()
        for idx, grp in enumerate(sec_groups):
            print('{}:\t{}\t{}\t{}\t{}'.format(idx, grp.id, grp.owner_id, grp.name, grp.description))
        print('')

        selected_sg = None
        try:
            uin = int(input('Pick security group (1 or 3): '))
            if uin in range(0, len(sec_groups)):
                selected_sg = sec_groups[uin]
            else:
                print_invalid_exit()
        except ValueError:
            print_invalid_exit()

        if selected_sg is not None:
            uin = input('Enter ports to open: ')
            ports = []
            for i in uin.split():
                try:
                    port = int(i)
                    if port not in range(1, 65535):
                        print_invalid_exit()
                    ports.append(port)
                except ValueError:
                    print_invalid_exit()

            if len(ports) < 1:
                print_invalid_exit()

            print(CHECKED + 'Adding rules to security group {} with opening ports {}'.format(selected_sg.name, ports))
            for p in ports:
                firewall.open_tcp_port(p, selected_sg.name)

    print_footer()

    # ---------------
    print_heading('Volumes Provision')
    uin = input('Provision volumes? (y or n): ')
    if uin == 'y':
        uin = input('Create new volumes? (y or n): ')
        if uin == 'y':
            try:
                req_vol_count = int(input('How many? (num > 0): '))
                req_vol_size = int(input('Enter size GB (size > 0): '))
                if req_vol_size < 1:
                    print_invalid_exit()
                for c in range(req_vol_count):
                    req_vol = volumes.create_volume(req_vol_size)
            except ValueError:
                print_invalid_exit()

        vol_list = conn.get_all_volumes()
        if len(vol_list) > 0:
            # nested
            print_footer()
            print_heading('Volumes Allocation')
            for idx, vol in enumerate(vol_list):
                print(' \t{}\t{}GB\t{}\t{}'.format(vol.id, vol.size, vol.zone, vol.status))
            print('')
            for vol in vol_list:
                if vol.status == 'available':
                    uin = input('Do you like to attach {} now? (y or n): '.format(vol.id))
                    if uin == 'y':
                        try:
                            sel_inst_idx = int(input('Pick an instance index number: '))
                            if sel_inst_idx not in range(0, len(selected_ix)):
                                print_invalid_exit()
                            else:
                                dev_name = '/dev/vdc'
                                uin = input('Enter device name ({}): '.format(dev_name))
                                if uin != '':
                                    dev_name_ok = re.match('\/dev\/vd[a-z]', uin)
                                    if dev_name_ok is None:
                                        print_invalid_exit()
                                    else:
                                        dev_name = uin
                                sel_inst = selected_ix[sel_inst_idx]
                                success = conn.attach_volume(vol.id, sel_inst.id, device=dev_name)
                                if success:
                                    print(CHECKED + 'Volume {} has successfully attached to {}.'
                                          .format(vol.id, sel_inst.id))
                                else:
                                    print(FAILED + 'Failed to attach volume {} to {}.'
                                          .format(vol.id, sel_inst.id))
                        except ValueError:
                            print_invalid_exit()
                    else:
                        pass
        else:
            print('\nYou have no volumes provisioned.')
    else:
        pass

    print_footer()

    # ---------------
    print_heading('Ansibling')

    for ix in selected_ix:
        if ix.state == u'running':
            ssh_known_hosts(ix.private_ip_address)

    key_file_path = config.parser['local']['key_file_path']
    key_file = config.parser['local']['key_file']

    username = 'ubuntu'
    uin = input('Enter login username ({}): '.format(username))
    if uin is not None and uin != '':
        username = uin

    play_recipe_path = 'automaton/playbooks/'
    uin = input('Enter playbook recipe path ({}): '.format(play_recipe_path))
    if uin is not None and uin != '':
        play_recipe_path = uin
    print(CHECKED + play_recipe_path)

    play_recipe = 'test.yaml'
    uin = input('Enter playbook recipe path ({}): '.format(play_recipe))
    if uin is not None and uin != '':
        play_recipe = uin

    verbose = False
    uin = input('Verbose i.e. \'-v\' (y): ')
    if uin == 'y':
        verbose = True

    cmd = 'ansible-playbook'
    cmd += ' -i ' + host_file
    cmd += ' -u ' + username
    cmd += ' -b --become-method=sudo'
    cmd += ' --key-file=' + os.path.join(key_file_path, key_file)
    if verbose:
        cmd += ' -v'
    cmd += ' ' + os.path.join(play_recipe_path, play_recipe)
    cmd += ' --extra-vars "'  # TODO: read extra variable from json file
    cmd += 'admin=' + config.parser['db']['admin']
    cmd += ' cookie=' + config.parser['db']['cookie']
    cmd += ' password=' + config.parser['db']['password']
    cmd += '"'

    print(cmd)

    uin = input('Execute? (y or n): ')
    if uin == 'y':
        print('Launching in T minus time')
        countdown(3)
        print('')
        for i in range(50):
            time.sleep(0.05)
            print('.', end='', flush=True)
        print('')
        process = subprocess.Popen(shlex.split(cmd))
        process.communicate()
    else:
        abort()


if __name__ == '__main__':
    """
    Ansible has very specific SSH implementation that works nicely in *nix environment.
    No hope for Windows and Cygwin. For Windows, the only hope is WSL Bash on Ubuntu on Windows.
    Or VirtualBox.
    """

    colorama.init()
    os_env = platform.system()
    if 'Windows' in os_env or 'CYGWIN' in os_env:
        print(Fore.RED + 'Script does not run on {}'.format(os_env).upper())
        exit()
    main()
    colorama.deinit()
