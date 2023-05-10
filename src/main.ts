import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/style/index.scss';

// @ts-ignore
import VueHighlightJS from 'vue3-highlightjs';
import 'highlight.js/styles/atom-one-dark.css';

const app = createApp(App);

import { popover } from './components/popover-v2/directive';
app.directive('popover', popover);

app.use(VueHighlightJS).use(router).mount('#app');
