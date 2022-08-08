import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { config } from '../dapp.config';

const Hero = () => {
    return (
      <div className=" bg-transparent">
        <Image
            src="/images/Blur.gif"
            alt='Background'
            layout='fill'
          />
        <div className="relative w-full h-full flex flex-col items-center justify-center">
        <Head>
          <title>{config.title}</title>
          <meta name="description" content={config.description} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <header className=" container mx-auto justify-center">
          <div className="flex items-center justify-end space-x-4 md:space-x-14">
            <a href="https://twitter.com/StonersTownWTF" target="_blank" rel="noreferrer">
              <Image src="/images/Twitter.png" width="64" height="64"/>
            </a>
            <a href="https://opensea.io/collection/stonerstownwtf" target="_blank" rel="noreferrer">
              <Image src="/images/Opensea.png" width="64" height="64"/>
            </a>
            <a href="https://discord.gg/PrgT3nkKVr" rel="noreferrer">
              <Image src="/images/Discord.png" width="64" height="64"/>
            </a>
            <div className="flex items-center justify-end space-x-4 md:space-x-14">
              <Image src="/images/Logo.gif" rel="noreferrer" width="400" height="160" />
            </div>
          </div>
        </header>
  
        <div className="h-full w-full container max-w-5xl max-h-3xl mx-auto flex flex-col items-center pt-20">
          <div className="flex flex-col items-center max-w-4xl w-full p-20">
            <Link href="/mint" passHref>
            <a href="mint" target="_blank" className="mint">Mint!</a>
            </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Hero;