export default function Demo() {
  return (
    <section id="demo" className="py-20 bg-opacity-50 bg-purple-50">
      <div className="mx-8 max-w-7xl md:mx-10 lg:mx-20 xl:mx-auto">
        <div className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100">
          <div className="mb-12 space-y-5 text-left md:mb-20 md:text-center">
            <div className="inline-block px-3 py-1 text-sm font-semibold rounded-lg bg-purple-100 bg-opacity-60 text-purple-500 hover:cursor-pointer hover:bg-opacity-80">
              Standard in Action
            </div>
            <h1 className="text-3xl font-semibold text-gray-800 md:text-5xl">
              Play our mini game
            </h1>
            <p className="mx-auto text-xl md:w-2/3 md:text-2xl">
              Experiment the utility of TBAs with our infinite runner, generate an NFT profile 
              to play and receive all the power-ups inside of it.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-3xl px-8 mx-auto sm:px-6 lg:max-w-5xl lg:px-8">
        {/* <div className="inline-block px-3 py-1 text-sm rounded-lg bg-purple-100 bg-opacity-60 text-purple-500 hover:cursor-pointer hover:bg-opacity-80">
          Technology
        </div>
        <h2 className="mt-4 text-purple-800 text-3xl font-medium">
          Built with PhaserJS
        </h2>
        <p className="mt-4 text-lg font-normal lg:max-w-3xl">
          Aliquam ultrices sagittis orci a scelerisque purus. Ligula
          ullamcorper malesuada proin libero nunc consequat.
        </p> */}
        <a href="https://game.tobaontron.xyz" target="_blank">
          <img
            src="images/dinogame.jpg"
            className="mt-8 rounded-xl"
            alt="placeholder"
          />
        </a>
        <div className="grid grid-cols-1 grid-rows-1 gap-2 mt-4 md:auto-cols-auto md:grid-cols-3">
          <div className="flex flex-col justify-between p-5 transition duration-500 border-2 shadow-md border-tranparent rounded-xl bg-purple-200 bg-opacity-30 hover:border-purple-300 hover:shadow-xl">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Connect your TronLink Wallet
              </h3>
              <p className="mt-1 text-gray-800 text-md">
                You can play without a wallet but if you want to
                get a profile NFT and receive power-ups for your
                character you'll need to have the TronLink extension
                installed in your browser.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-5 transition duration-500 border-2 shadow-md border-tranparent rounded-xl bg-purple-200 bg-opacity-30 hover:border-purple-300 hover:shadow-xl">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Mint your profile NFT
              </h3>
              <p className="mt-1 text-gray-800 text-md">
                You would be able to mint a profile NFT after
                successfully connect TronLink and click on the profile
                button of the game's main section.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-5 transition duration-500 border-2 shadow-md border-tranparent rounded-xl bg-purple-200 bg-opacity-30 hover:border-purple-300 hover:shadow-xl">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Play and receive power-ups
              </h3>
              <p className="mt-1 text-gray-800 text-md">
                Now play and get power-ups for your character by making high scores,
                the receive them directly inside your profile NFT
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="max-w-3xl px-8 mx-auto sm:px-6 sm:pt-20 lg:max-w-5xl lg:px-8">
        <div className="inline-block px-3 py-1 mt-12 text-sm rounded-lg md:md-0 bg-purple-100 bg-opacity-60 text-purple-500 hover:cursor-pointer hover:bg-opacity-80">
          Product in Action
        </div>
        <h2 className="mt-4 bg-gradient-to-r from-[#1D976C] to-[#38ef7d] bg-clip-text text-3xl font-medium text-transparent">
          Continuously exceeds expectations
        </h2>
        <p className="mt-4 text-lg font-normal lg:max-w-3xl">
          Aliquam ultrices sagittis orci a scelerisque purus. Ligula
          ullamcorper malesuada proin libero nunc consequat.
        </p>
        <img
          src="images/product.png"
          className="mt-8 rounded-xl"
          alt="placeholder"
        />
        <div className="grid grid-cols-1 grid-rows-1 gap-2 mt-4 md:auto-cols-auto md:grid-cols-3">
          <div className="flex flex-col justify-between p-5 transition duration-500 border-2 shadow-md border-tranparent rounded-xl bg-purple-200 bg-opacity-30 hover:border-purple-300 hover:shadow-xl">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Defies the odds.
              </h3>
              <p className="mt-1 text-gray-800 text-md">
                Tortor dignissim convallis aenean et tortor at. At
                ultrices mi tempus imperdiet nulla malesuada.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-5 transition duration-500 border-2 shadow-md border-tranparent rounded-xl bg-purple-200 bg-opacity-30 hover:border-purple-300 hover:shadow-xl">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Creatively designed.
              </h3>
              <p className="mt-1 text-gray-800 text-md">
                Id cursus metus aliquam eleifend mi. Quis ipsum
                suspendisse ultrices gravida dictum fusce ut.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-5 transition duration-500 border-2 shadow-md border-tranparent rounded-xl bg-purple-200 bg-opacity-30 hover:border-purple-300 hover:shadow-xl">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Powerful.
              </h3>
              <p className="mt-1 text-gray-800 text-md">
                Tortor dignissim convallis aenean et tortor at. Id
                cursus metus aliquam eleifend mi.
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </section>
  );
}
