import _ from 'lodash';
import uiChrome from 'ui/chrome';

import newWatcherMenu from '../templates/new-watcher-top-nav.html';
import { app } from '../app.module';

const impactLogo = require('plugins/sentinl/sentinl-white-logo.svg');
const smallLogo = require('plugins/sentinl/sentinl.svg');

app.factory('navMenu', ['$rootScope', 'kbnUrl', function ($rootScope, kbnUrl) {
  return {
    setKbnLogo: function (isOpen) {
      if (isOpen) {
        uiChrome.setBrand({
          logo: `url(${impactLogo}) left no-repeat`,
        });
      } else {
        uiChrome.setBrand({
          logo: `url(${smallLogo}) left no-repeat`
        });
      }
    },
    getTopNav: function (view) {
      const nav = [
        {
          key: 'about',
          description: 'About',
          run: function () { kbnUrl.change('/about'); },
          testId: 'sentinlAbout'
        }
      ];

      if (view === 'watchers') {
        nav.unshift({
          key: 'new',
          description: 'Create new watcher',
          template: newWatcherMenu,
          testId: 'sentinlNewWatcher'
        });
        return nav;
      }

      if (view === 'editor') {
        const editorMenu = [
          {
            key: 'Cancel',
            description: 'Cancel editor',
            run: function () { $rootScope.$broadcast('navMenu:cancelEditor'); },
            testId: 'cancelEditor'
          },
          {
            key: 'Save',
            description: 'Save editor',
            run: function () { $rootScope.$broadcast('navMenu:saveEditor'); },
            testId: 'saveEditor'
          }
        ];

        _.forEach(editorMenu, (menu) => nav.unshift(menu));

        return nav;
      }

      return nav;
    },
    getTabs: function (path = '#/', tmpTabs = null) {
      const tabMenu = {
        currentPath: path.includes('#/') ? path : `#/${path}`,
        list: [
          { display: 'Watchers', url: '#/'},
          { display: 'Alarms', url: '#/alarms'},
          { display: 'Reports', url: '#/reports'}
        ]
      };

      if (tmpTabs) {
        _.forEach(tmpTabs, (tab) => tabMenu.list.push({ display: tab.name, url: tab.url }));
      } else {
        tabMenu.list = _.filter(tabMenu.list, (tab) => _.includes(['Watchers', 'Alarms', 'Reports'], tab.display));
      }

      return tabMenu;
    }
  };
}]);
