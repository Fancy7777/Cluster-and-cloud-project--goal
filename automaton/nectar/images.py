import re

from automaton.nectar import connection

images = connection.establish().get_all_images()


def list_all():
    for img in images:
        print('id: {}, name: {}'.format(img.id, img.name))


def list_by_nectar():
    for img in images:
        if img.name.startswith('NeCTAR'):
            print('id: {}, name: {}'.format(img.id, img.name))


def list_by_expression(exp):
    for img in images:
        if re.match(exp, img.name):
            print('id: {}, name: {}'.format(img.id, img.name))


def main():
    list_all()
    print('=' * 100)
    list_by_nectar()
    print('=' * 100)
    list_by_expression(r'^NeCTAR Ubuntu')
    print('=' * 100)
    list_by_expression(r'^NeCTAR Ubuntu 16.04')
    print('=' * 100)
    list_by_expression(r'^NeCTAR CentOS')


if __name__ == '__main__':
    main()
