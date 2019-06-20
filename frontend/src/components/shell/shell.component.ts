import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import '@polymer/iron-pages/iron-pages';
import '@polymer/iron-selector/iron-selector';
import '@polymer/paper-icon-button/paper-icon-button';
import * as Oidc from 'oidc-client';
import * as jwt from 'jsonwebtoken';

import { userManagerSettings } from '../../constants';

import view from './shell.template.html';
import style from './shell.style.scss';

export class MyApp extends PolymerElement {
  $: any;
  page: any;
  accessToken = "";

  static get is() {
    return 'my-app';
  }

  static get template() {
    return html([`<style include="shared-styles">${style}</style>${view}`]);
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      endpoint: {
        type: String,
        reflectToAttribute: true
      },
      routeData: Object,
      subroute: Object,
      // This shouldn't be necessary, but the Analyzer isn't picking up
      // Polymer.Element#rootPath
      rootPath: String,
      queryParams: Object
    };
  }

  static get observers() {
    return ['_routePageChanged(routeData.page)'];
  }

  _routePageChanged(page: string) {
    this.page = page || 'view1';
    console.log('_routePageChanged ', this.page);

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page: string) {
    // Load page import on demand. Show 404 page if fails
    let component = '';
    console.log('Get page ', page);
    switch (page) {
      case 'view1':
        component = 'my-view1';
        break;
      default:
        component = 'my-view404';
        break;
    }

    import(/* webpackMode: "lazy" */
      `../${component}/${component}.component`)
      .then(() => {
        const instance: any = this.$[page];
        if (instance.resetState !== undefined) {
          console.log('Get page before reset state');
          instance.resetState();
          console.log('Get page after state');
        }
      })
      .catch((e) => {
        console.log(e);
        this._showPage404.bind(this);
      });
  }

  _showPage404() {
    this.page = 'view404';
  }

  startLoading() {
    this.$.loading.style = 'display: block;';
    this.$.loading.value = 0;
    setTimeout(() => {
      this.$.loading.value = 70;
    }, 500);
  }

  finishLoading() {
    this.$.loading.value = 100;
    setTimeout(() => {
      this.$.loading.style = 'display: none;';
    }, 1000);
  }

  userManager: Oidc.UserManager = new Oidc.UserManager(userManagerSettings);

  async connectedCallback() {
    super.connectedCallback();

    const user: Oidc.User = await this.userManager.getUser();
    console.log('user', user);

    if (user === null) {
      this.userManager
        .signinRedirect({
          redirect_uri: `${this.rootPath}login-callback.html`
        })
        .then(user => {
          console.log('signin response success', user);
        })
        .catch(err => {
          console.log('err', err);
        });
    } else {
      this.accessToken = user.access_token;
      const parsedJwt: any = jwt.decode(user.access_token);
      console.log('authorized: ', { parsedJwt });
    }
  }

  _logout() {
    this.userManager
      .signoutRedirect({
        post_logout_redirect_uri: `${this.rootPath}`
      })
      .then(() => {
        console.log('logout response success');
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  ready() {
    super.ready();
    window.addEventListener('start-loading', () => {
      this.startLoading();
    });
    window.addEventListener('finish-loading', () => {
      this.finishLoading();
    });
  }
}

window.customElements.define(MyApp.is, MyApp);
