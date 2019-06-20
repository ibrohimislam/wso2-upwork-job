import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import view from './my-view404.template.html';
import style from './my-view404.style.scss';

export class MyView404 extends PolymerElement {
  $: any;

  static get is() {
    return 'my-view404';
  }

  static get template() {
    return html([`<style>${style}</style>${view}`]);
  }
}

window.customElements.define(MyView404.is, MyView404);
