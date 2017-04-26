from automaton.nectar import vm


def main():
    vm.show_reservations_and_instances()

    print('=' * 100)
    uin = input('Create new instance (y or n): ')
    if uin == 'y':
        cnt = int(input('How many? (1-50): '))
        if cnt in range(1, 50):
            vm.create_server(cnt)
        else:
            print('What\'s that? {}'.format(cnt))
            exit(0)
    elif uin == 'n':
        print('Alright!')
    else:
        print('Excuse me?')

    if len(vm.my_instances) < 1:
        exit(0)

    print('=' * 100)
    uin = input('Start all instances (y or n): ')
    if uin == 'y':
        vm.conn.start_instances(list(vm.my_instances))
        vm.time.sleep(10)
        vm.show_reservations_and_instances()
    elif uin == 'n':
        print('Fine!')
    else:
        print('Pardon?')

    print('=' * 100)
    uin = input('Stop all instances (y or n): ')
    if uin == 'y':
        vm.conn.stop_instances(list(vm.my_instances))
        vm.time.sleep(10)
        vm.show_reservations_and_instances()
    elif uin == 'n':
        print('Ok!')
    else:
        print('Why?')

    print('=' * 100)
    uin = input('[WARNING] Terminate all instances (y or n): ')
    if uin == 'y':
        vm.conn.terminate_instances(list(vm.my_instances))
        vm.time.sleep(10)
        vm.show_reservations_and_instances()
    elif uin == 'n':
        print('Fair enough!')
    else:
        print('What?')


if __name__ == '__main__':
    main()
