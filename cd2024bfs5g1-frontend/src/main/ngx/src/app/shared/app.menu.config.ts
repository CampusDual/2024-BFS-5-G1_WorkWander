import { MenuRootItem } from 'ontimize-web-ngx';

export const MENU_CONFIG: MenuRootItem[] = [
  { id: 'coworkingsHome', name: 'COWORKINGS', icon: 'home', route: '/main/coworkings' },
  { id: 'coworkingsPublic', name: 'COWORKINGS', icon: 'home', route: '/coworkings' },
  { id: 'coworkings', name: 'ADD_COWORKING', icon: 'people', route: '/main/coworkings/new'},
    {id: 'admin', name: 'ADMIN', tooltip: 'ADMIN', icon: 'admin_panel_settings',
    items: [
      { id: 'roles', name: 'ROLES', tooltip: 'ROLES', route: '/main/admin/roles', icon: 'supervisor_account' },
      { id: 'users', name: 'USERS', tooltip: 'USERS', route: '/main/admin/users', icon: 'person' },
    ]
  },
  { id: 'MyCoworkings', name: 'MYCOWORKINGS', tooltip:'MyCoworkings', route: '/main/mycoworkings', icon: 'filter_list' },
  // Cuando se haga la funcionalidad de mostrar la tabla de eventos, habría que cambiar el route por '/main/events'.
  { id: 'newEvents', name: 'NEW_EVENT', tooltip: 'NEW_EVENT', route: '/main/events/new', icon: 'event' },
  { id: 'myEvents', name: 'MY_EVENT', tooltip: 'MY_EVENTS', route: '/main/events/myevents', icon: 'event' },
  { id: 'logout', name: 'LOGOUT', route: '/login', icon: 'power_settings_new', confirm: 'yes' },
  { id: 'login_public', name: 'LOGIN', route: '/login', icon: 'power_settings_new', confirm: 'no' }
];
