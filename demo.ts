import { DefaultProvider, sha256, bsv, toByteString } from 'scrypt-ts';
import { Demo } from './src/contracts/demo';
import { NeucronSigner } from 'neucron-signer';

async function main() {
    try {
        const provider = new DefaultProvider({ network: bsv.Networks.mainnet });
        const signer = new NeucronSigner(provider);
        const amount = 1;

        await signer.login('sales@timechainlabs.io', 'string');
        await Demo.loadArtifact();

        const message = toByteString('timechainlabs', true);
        const instance = new Demo(sha256(message));
        await instance.connect(signer);

        const deployTx = await instance.deploy(amount);
        console.log('Smart lock deployed: https://whatsonchain.com/tx/' + deployTx.id);

        // Wait for deployment to be confirmed
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Unlock the contract
        const { tx: callTx } = await instance.methods.unlock(message);
        console.log('Contract unlocked successfully: https://whatsonchain.com/tx/' + callTx.id);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
