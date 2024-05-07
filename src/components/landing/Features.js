import { IconBriefcase, IconDeviceGamepad, IconMusic } from "@tabler/icons-react";

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-t from-[#524790] to-[#8c79ed]"
    >
      <div className="mx-8 max-w-7xl md:mx-10 lg:mx-20 xl:mx-auto">
        <div className="space-y-16 md:space-y-24">
          <div className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100">
            <div className="space-y-5 md:text-center">
              <div className="inline-block rounded-lg bg-[#302953] bg-opacity-60 px-3 py-1 text-sm font-semibold text-indigo-100 hover:cursor-pointer hover:bg-opacity-40">
                Awesome Utility
              </div>
              <h1 className="text-3xl font-semibold text-gray-100 md:text-5xl">
                Decked with innovative usecases.
              </h1>
              <p className="text-xl text-gray-200 md:text-2xl max-w-3xl mx-auto">
                Any TRON dev can use the Token-Bound Accounts to <span className="font-semibold">generate</span>{' '}
                new experiences with TRC-721 tokens
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 grid-rows-1 gap-8 text-lg md:grid-cols-2 lg:grid-cols-3">
            <div className="flex shadow-md hover:shadow-[#00e4ff] flex-col justify-start p-5 transition duration-400 bg-white bg-opacity-20 rounded-xl card-hover group space-y-5">
              <IconDeviceGamepad 
                color="#fff"
                className="border-[#322e37] bg-gradient-to-b from-[#5b585f] to-[#2d2a33] h-10 w-10 rounded-full border p-2 transition duration-400 group-hover:border-[#00e4ff] group-hover:shadow-[#00e4ff] group-hover:shadow-sm"
              />
              <h3 className="text-xl font-semibold text-white">
                Gaming
              </h3>
              <p className="text-gray-200">
              With token-bound accounts, game creators have the ability 
              to set up inventories for players, enabling the automatic transfer 
              of all their game items to their character's collection. This enriches 
              the player experience and facilitates the creation of game user interfaces
              that were previously more complex to develop
              </p>
            </div>
            <div className="flex shadow-md hover:shadow-[#00e4ff] flex-col justify-start p-5 transition duration-400 bg-white bg-opacity-20 rounded-xl card-hover group space-y-5">
              <IconBriefcase
                color="#fff"
                className="border-[#322e37] bg-gradient-to-b from-[#5b585f] to-[#2d2a33] h-10 w-10 rounded-full border p-2 transition duration-400 group-hover:border-[#00e4ff] group-hover:shadow-[#00e4ff] group-hover:shadow-sm"
              />
              <h3 className="text-xl font-semibold text-white">
                Portfolio Management
              </h3>
              <p className="text-gray-200">
              NFTs can represent unique investment assets, and these assets can 
              be further diversified and managed within the NFT itself. This offers an 
              innovative way for investors to manage their portfolios while maintaining a 
              clear record of ownership and diversified holdings within a single NFT.
              </p>
            </div>
            <div className="flex shadow-md hover:shadow-[#00e4ff] flex-col justify-start p-5 transition duration-400 bg-white bg-opacity-20 rounded-xl card-hover group space-y-5">
              <IconMusic
                color="#fff"
                className="border-[#322e37] bg-gradient-to-b from-[#5b585f] to-[#2d2a33] h-10 w-10 rounded-full border p-2 transition duration-400 group-hover:border-[#00e4ff] group-hover:shadow-[#00e4ff] group-hover:shadow-sm"
              />
              <h3 className="text-xl font-semibold text-white">
                Music
              </h3>
              <p className="text-gray-200">
              For example, an artist could create NFTs that represent 
              ownership of a multiple songs inside an album, and fans who collect these NFTs 
              could gain access to exclusive content such as unreleased tracks, 
              behind-the-scenes footage, or virtual meet-and-greets with the artist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
