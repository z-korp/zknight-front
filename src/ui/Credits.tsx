import twitterPixelIcon from '../assets/twitter_pixel_icon.png';

const Credits = () => {
  return (
    <>
      <h1 className="text-black mb-4 text-center">Credits</h1>
      <hr className="my-4 border-2" />

      <div className="flex flex-col items-center justify-between">
        <div className="flex flex-col items-start card">
          <h2 className="text-black mb-2">Created by :</h2>
          <ul className="list-none">
            {[
              { name: 'Bal7hazar', link: 'https://twitter.com/bal7hazar' },
              { name: 'Matthias', link: 'https://twitter.com/ProvableMat' },
              { name: 'Cheelax', link: 'https://twitter.com/Cheelax_' },
            ].map(({ name, link }) => (
              <li className="mb-2 flex items-center" key={name}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center text-black">
                  <img
                    src={twitterPixelIcon}
                    alt="Twitter"
                    className="w-12 h-12 mr-2"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <span>{name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start card">
          <hr className="my-5 border-2" />

          <h2 className="text-black mb-2">Resources Used :</h2>
          <ul>
            <li>
              <a
                href="https://merchant-shade.itch.io/16x16-puny-characters-plus-sprites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black"
              >
                Pixel art by Merchant Shade
              </a>
            </li>
            <li>
              <a href="https://pixijs.io/" target="_blank" rel="noopener noreferrer" className="text-black">
                Pixijs
              </a>
            </li>
            <li>
              <a href="https://www.zapsplat.com/" target="_blank" rel="noopener noreferrer" className="text-black">
                Sound from Zapsplat.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Credits;
