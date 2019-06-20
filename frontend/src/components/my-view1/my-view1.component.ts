import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-input/paper-input';

import view from './my-view1.template.html';
import style from './my-view1.style.scss';

export class MyView1 extends PolymerElement {
  $: any;

  responseBackendTest1 = '';
  responseBackendTest2 = '';
  responseBackendTest3 = '';

  static ENDPOINT_BACKEND_TEST_1 = 'http://localhost:9001/';
  static ENDPOINT_BACKEND_TEST_2 = 'http://localhost:9002/';
  static ENDPOINT_BACKEND_TEST_3 = 'http://localhost:9003/';

  accessToken = "";

  ready() {
    super.ready();
  }

  private async backendTestWithAccessToken(url: string, accessToken: string) {
    const response = await fetch(url, {
      headers: new Headers({ 'Authorization': `Bearer $accessToken}` }),
    });
    const responseData = await response.json();
    return responseData.test;
  }

  private async backendTestWithoutAccessToken(url: string) {
    const response = await fetch(url);
    const responseData = await response.json();
    return responseData.test;
  }

  async _testWithAccessToken() {
    // endpoint can be changed here
    this.responseBackendTest1 = await this.backendTestWithAccessToken(
      MyView1.ENDPOINT_BACKEND_TEST_1, this.accessToken);
    this.responseBackendTest2 = await this.backendTestWithAccessToken(
      MyView1.ENDPOINT_BACKEND_TEST_2, this.accessToken);
    this.responseBackendTest3 = await this.backendTestWithAccessToken(
      MyView1.ENDPOINT_BACKEND_TEST_3, this.accessToken);
  }

  async _testWithoutAccessToken() {
    // endpoint can be changed here
    this.responseBackendTest1 = await this.backendTestWithoutAccessToken(
      MyView1.ENDPOINT_BACKEND_TEST_1);
    this.responseBackendTest2 = await this.backendTestWithoutAccessToken(
      MyView1.ENDPOINT_BACKEND_TEST_2);
    this.responseBackendTest3 = await this.backendTestWithoutAccessToken(
      MyView1.ENDPOINT_BACKEND_TEST_3);
  }

  _testClear() {
    this.responseBackendTest1 = '';
    this.responseBackendTest2 = '';
    this.responseBackendTest3 = '';
  }

  connectedCallback() {
    super.connectedCallback();
  }

  static get is() {
    return 'my-view1';
  }

  static get template() {
    return html([`<style>${style}</style>${view}`]);
  }
}

window.customElements.define(MyView1.is, MyView1);
