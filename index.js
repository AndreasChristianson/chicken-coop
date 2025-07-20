import Hapi from '@hapi/hapi'
import {StillCamera} from "pi-camera-connect";

async function takePhoto() {
    const camera = new StillCamera();
    try {
        const image = await camera.takeImage();
        console.log('Photo taken');
        return image;
    } catch (error) {
        console.error('Error taking photo:', error);
    }
}

const PORT = process.env.PORT || 3000

const init = async () => {

    const server = Hapi.server({
        port: PORT,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/snapshot',
        handler: async (request, h) => {
            return h.response( await takePhoto())
                .type('image/jpeg')
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init()
    .then(r => console.log("server started"));
