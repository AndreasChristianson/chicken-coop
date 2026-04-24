Local development notes

Run the server and client locally with mocked hardware (useful on macOS or dev machines):

1) Install dependencies

  cd server && npm install
  cd ../client && npm install

2) Start server with hardware mocked

  # from repository root
  MOCK_HARDWARE=1 cd server && npm start

This enables two behaviors useful for local dev:
- Relays are mocked (no GPIO access required)
- Temperature sensors return realistic-looking random values

3) Start the client

  cd client && npm start

Alternate: build the client and serve with the server

  cd client && npm run build
  # in repository root
  cd server && npm start

To run against real Raspberry Pi hardware, do NOT set MOCK_HARDWARE and ensure the `onoff` and w1 drivers are installed and accessible by the server process.
