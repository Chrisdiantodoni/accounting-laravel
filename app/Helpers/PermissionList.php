<?php

namespace App\Helpers;

class PermissionList
{
    const permissionEmployee = [
        [
            'alias_name' => 'View Dashboard',
            'name' =>   'read_dashboard',
            'group_name' => 'Dashboard'
        ],
        [
            'alias_name' => 'Edit Employee',
            'name' =>   'edit_employee',
            'group_name' => 'Employee'
        ],
        [
            'alias_name' => 'Get Employee',
            'name' =>   'read_employee',
            'group_name' => 'Employee'

        ],
        [
            'alias_name' => 'Add New Employee',
            'name' => 'add_new_employee',
            'group_name' => 'Employee'
        ],
        [
            'alias_name' => 'Edit Status Employee',
            'name' => 'put_status_employee',
            'group_name' => 'Employee'
        ],
        [
            'alias_name' => 'Detail Employee',
            'name' => 'show_employee',
            'group_name' => 'Employee'
        ],

    ];
    const permissionUser = [
        [
            'alias_name' => 'Get User List',
            'name' => 'read_user_list',
            'group_name' => 'User'
        ],
        [
            'alias_name' => 'Edit User',
            'name' => 'edit_user',
            'group_name' => 'User'
        ],
        [
            'alias_name' => 'Add New User',
            'name' => 'add_new_user',
            'group_name' => 'User'
        ],
        [
            'alias_name' => 'Change Status User',
            'name' => 'put_status_user',
            'group_name' => 'User'
        ],

    ];
    const permissionMaster = [
        [
            'alias_name' => 'Get Department List',
            'name' => 'read_master_department',
            'group_name' => 'Master'
        ],
        [
            'alias_name' => 'Edit Department',
            'name' => 'edit_master_department',
            'group_name' => 'Master'
        ],
        [
            'alias_name' => 'Add New Department',
            'name' => 'add_master_department',
            'group_name' => 'Master'
        ],
        [
            'alias_name' => 'Change Department Status',
            'name' => 'put_department_status',
            'group_name' => 'Master'
        ],
        [
            'alias_name' => 'Get Position List',
            'name' => 'read_master_position',
            'group_name' => 'Master'
        ],
        [
            'alias_name' => 'Edit Position',
            'name' => 'edit_master_position',
            'group_name' => 'Master'
        ],
        [
            'alias_name' => 'Add New Position',
            'name' => 'add_master_position',
            'group_name' => 'Master'
        ],
        [
            'alias_name' => 'Change Position Status',
            'name' => 'put_position_status',
            'group_name' => 'Master'
        ],

    ];


    public static function AllPermission()
    {
        return array_merge(self::permissionEmployee, self::permissionUser, self::permissionMaster);
    }
}
