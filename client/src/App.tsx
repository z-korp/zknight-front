import { sound } from '@pixi/sound';
import 'font-awesome/css/font-awesome.min.css';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { shortString } from 'starknet';
import { useDojo } from './DojoContext';
import twitterPixelIcon from './assets/twitter_pixel_icon.png'; // Ajustez le chemin d'accès à votre projet
import Canvas from './ui/Canvas';
import CreditsButton from './ui/CreditsButton';
import LeaderBoardButton from './ui/LeaderBoardButton';
import Leaderboard from './ui/Leaderboard';

const gamesa = [
  { stage: 1, score: 100, player: '0x123' },
  { stage: 2, score: 90, player: '0x124' },
  { stage: 3, score: 95, player: '0x125' },
  { stage: 4, score: 110, player: '0x123' },
  { stage: 5, score: 120, player: '0x126' },
  { stage: 6, score: 85, player: '0x124' },
  { stage: 7, score: 105, player: '0x127' },
  { stage: 8, score: 80, player: '0x128' },
  { stage: 9, score: 110, player: '0x129' },
  { stage: 10, score: 70, player: '0x130' },
  { stage: 11, score: 100, player: '0x131' },
  { stage: 12, score: 60, player: '0x132' },
  { stage: 13, score: 85, player: '0x133' },
  { stage: 14, score: 75, player: '0x134' },
];

function App() {
  const {
    setup: {
      network: { graphSdk },
    },
  } = useDojo();

  Modal.setAppElement('#root');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLeaderBoardModalOpen, setLeaderBoardModalOpen] = useState(false);
  const [isMusicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    if (isMusicPlaying) {
      sound.play('my-sound');
    } else {
      sound.stopAll();
    }
  }, [isMusicPlaying]);

  const toggleMusic = () => {
    setMusicPlaying(!isMusicPlaying);
  };

  const toggleLeaderBoardModal = () => {
    setLeaderBoardModalOpen(!isLeaderBoardModalOpen);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const modalStyle = {
    content: {
      top: '50%', // centré verticalement
      left: '50%', // centré horizontalement
      width: '80%', // Reduit la largeur
      height: '60%', // Reduit la hauteur
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      // fontFamily: '"Press Start 2P", cursive', // Utilisez la police qui vous donne un look de pixel art
      fontSize: '16px',
      border: '4px solid #000',
      boxShadow: '5px 5px #000',
      textColor: 'red',
      //... autres styles pour un look pixel art
    },
  };

  const credits = async () => {
    toggleModal();
  };

  const [games, setGames] = useState<{ stage: number; score: number; player: string }[]>(gamesa);

  useEffect(() => {
    sound.add('my-sound', './assets/music.mp3');
    const fetchData = async () => {
      try {
        const { data } = await graphSdk.getFinishedGames();

        console.log('data', data);
        if (data && data.mapComponents && data.mapComponents.edges) {
          const gameComponentsWithKeys: any[] = [];

          data.mapComponents.edges.forEach((edge) => {
            if (edge && edge.node?.score !== undefined && edge.node?.name && edge.node?.level) {
              gameComponentsWithKeys.push({
                score: edge.node?.score,
                level: edge.node?.level,
                player: shortString.decodeShortString(edge.node?.name),
              });
            }
          });

          console.log('gameComponentsWithKeys', gameComponentsWithKeys);
          setGames(gameComponentsWithKeys);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('games', games);
  }, [games]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex justify-between space p-2">
        <LeaderBoardButton onClick={toggleLeaderBoardModal}></LeaderBoardButton>
        <div className="flex justify-center items-center text-8xl text">zKnight</div>
        <CreditsButton onClick={credits}></CreditsButton>
        <button
          onClick={toggleMusic}
          className="p-2 mr-2 text-2xl w-6"
          style={{ position: 'absolute', top: 5, right: 10 }}
        >
          {isMusicPlaying ? <i className="fa fa-volume-up"></i> : <i className="fa fa-volume-off"></i>}
        </button>
      </div>

      <div className="flex-grow mx-auto mt-2">
        <Canvas setMusicPlaying={setMusicPlaying} />
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={toggleModal} style={modalStyle} ariaHideApp={false}>
        <div className="relative">
          <button onClick={toggleModal} className="absolute top-[-10px] right-0 p-2">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 w-1 h-full bg-black transform rotate-45 origin-center"></div>
              <div className="absolute inset-0 w-1 h-full bg-black transform -rotate-45 origin-center"></div>
            </div>
          </button>
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
        </div>
      </Modal>

      <Modal
        isOpen={isLeaderBoardModalOpen}
        onRequestClose={toggleLeaderBoardModal}
        style={modalStyle}
        ariaHideApp={false}
      >
        <div className="relative">
          <button onClick={toggleLeaderBoardModal} className="absolute top-[-10px] right-0 p-2">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 w-1 h-full bg-black transform rotate-45 origin-center"></div>
              <div className="absolute inset-0 w-1 h-full bg-black transform -rotate-45 origin-center"></div>
            </div>
          </button>
          <Leaderboard games={games} />
        </div>
      </Modal>
    </div>
  );
}

export default App;
