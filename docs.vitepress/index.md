---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'NotifyBC'
  tagline: 'A versatile notification API server'
  image:
    src: /img/logo.svg
    alt: NotifyBC
  actions:
    - theme: brand
      text: Quick Start →
      link: /docs/quickstart/

features:
  - title: Versatile
    details: <ul><li>Anonymous or authenticated subscriptions</li><li>Push and in-app pull notifications</li><li>Email and SMS push notification channels</li><li>Unicast and broadcast message types</li><li>Broadcast push notification filter rules specifiable by both sender and subscriber</li><li>Notification auto-gen from RSS</li></ul>
  - title: Non-intrusive
    details: >
      <ul>
        <li>Handles common backend business logic only, allowing site developer implement frontend UI using widgets native to the site
        </li>
        <li>Loose coupling - interacts with user browser or other server components through RESTful API
        </li>
      </ul>
  - title: Secure & Reliable
    details: >
      <ul>
        <li>Support end-to-end encryption
        </li>
        <li>Multiple authentication strategies including client certificate for server-server and OIDC for user-server</li>
        <li>Resilient to node failures</li>
      </ul>
---

<style lang="less">
.VPContent .VPHome{
  padding-bottom: 1rem;
  .VPHero {
    padding-top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) !important;
    .container {
      justify-content: center;
      .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        .actions {
            justify-content: center !important;
        }
      }
    }
  }
  .VPFeature {
    ul {
      list-style: unset;
    }
  }
}
</style>
