export default {
  repo: '/ipfs/shared/',
  start: true,
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      Swarm: [
        // '/ip4/127.0.0.1/tcp/9090/wss/p2p-webrtc-star',
        '/ip4/54.237.216.212/tcp/9090/ws/p2p-webrtc-star'
        // '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',
      ]
    }
  }
}
