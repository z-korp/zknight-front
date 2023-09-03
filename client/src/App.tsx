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

  const [games, setGames] = useState<{ id: number; score: number; player: string }[]>([]);

  useEffect(() => {
    sound.add('my-sound', './assets/music.mp3');
    const fetchData = async () => {
      try {
        const { data } = await graphSdk.getFinishedGames();

        console.log('data', data);
        if (data && data.gameComponents && data.gameComponents.edges) {
          const gameComponentsWithKeys: any[] = [];

          data.gameComponents.edges.forEach((edge) => {
            if (edge && edge.node?.game_id && edge.node?.score && edge.node?.name) {
              gameComponentsWithKeys.push({
                id: edge.node?.game_id,
                score: edge.node?.score,
                player: shortString.decodeShortString(edge.node?.name),
              });
            }
          });

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
          <h1 className="text-black mb-4 text-center">Leaderboard</h1>
          <hr className="my-4 border-2" />

          <div className="flex flex-col items-center justify-between">
            {/* Grouper par joueur et trouver le meilleur score pour chaque joueur */}
            {(() => {
              const playerScores: { [key: string]: number } = {};
              for (const game of games) {
                if (!playerScores[game.player] || playerScores[game.player] < game.score) {
                  playerScores[game.player] = game.score;
                }
              }

              // Convertir l'objet en un tableau et trier par score
              const sortedPlayers = Object.keys(playerScores)
                .map((player) => ({ player, score: playerScores[player] }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 10); // Prendre les 10 premiers

              return sortedPlayers.map((entry, index) => (
                <div key={index} className="flex justify-around w-full  py-2 text-black">
                  <span className="w-10 text-right">{index + 1}.</span>
                  <span className="mr-50 w-40">{entry.player}</span>
                  <span className="ml-50 w-40 text-right">{entry.score}</span>
                </div>
              ));
            })()}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
