import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDojo } from './DojoContext';
import twitterPixelIcon from './assets/twitter_pixel_icon.png'; // Ajustez le chemin d'accès à votre projet
import Canvas from './ui/Canvas';
import CreditsButton from './ui/CreditsButton';
import LeaderBoardButton from './ui/LeaderBoardButton';
import NewGameButton from './ui/NewGameButton';
import { useElementStore } from './utils/store';

function App() {
  const {
    setup: {
      network: { graphSdk },
      systemCalls: { create, play },
    },
    account: { account },
  } = useDojo();

  Modal.setAppElement('#root');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLeaderBoardModalOpen, setLeaderBoardModalOpen] = useState(false);

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

  const { add_hole, set_size, reset_holes } = useElementStore((state) => state);

  // entity id - this example uses the account address as the entity id
  const entityId = account.address;

  // get current component values
  //const position = useComponentValue(Position, parseInt(entityId.toString()) as EntityIndex);
  //const moves = useComponentValue(Moves, parseInt(entityId.toString()) as EntityIndex);

  const generateNewGame = async () => {
    // Logique pour générer un nouveau jeu
    // Par exemple, réinitialiser les composants Position et Moves
    //setComponent(Position, parseInt(entityId.toString()) as EntityIndex, { x: 0, y: 0 });
    //setComponent(Moves, parseInt(entityId.toString()) as EntityIndex, { remaining: 100 });
    // Si vous avez besoin de faire des appels réseau
    // await call('someNetworkFunction', { someParam: 'someValue' });
    // Autres initialisations
    // ...
    create(account, 10000, add_hole, set_size, reset_holes);
  };

  const credits = async () => {
    toggleModal();
  };

  useEffect(() => {
    if (!entityId) return;

    const fetchData = async () => {
      const { data } = await graphSdk.getEntities();

      if (data) {
        //const remaining = getFirstComponentByType(data.entities?.edges, 'Moves') as Moves;
        //const position = getFirstComponentByType(data.entities?.edges, 'Position') as Position;
        //setComponent(Moves, parseInt(entityId.toString()) as EntityIndex, { remaining: remaining.remaining });
        //setComponent(Position, parseInt(entityId.toString()) as EntityIndex, { x: position.x, y: position.y });
      }
    };
    fetchData();
  }, [account.address]);

  // const [games, setGames] = useState<any[]>([]);

  const games = [
    { id: 1, score: 100, player: '0x123' },
    { id: 2, score: 90, player: '0x124' },
    { id: 3, score: 95, player: '0x125' },
    { id: 4, score: 110, player: '0x123' },
    { id: 5, score: 120, player: '0x126' },
    { id: 6, score: 85, player: '0x124' },
    { id: 7, score: 105, player: '0x127' },
    { id: 8, score: 80, player: '0x128' },
    { id: 9, score: 110, player: '0x129' },
    { id: 10, score: 70, player: '0x130' },
    { id: 11, score: 100, player: '0x131' },
    { id: 12, score: 60, player: '0x132' },
    { id: 13, score: 85, player: '0x133' },
    { id: 14, score: 75, player: '0x134' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await graphSdk.getFinishedGames();

        if (data && data.entities && data.entities.edges) {
          const gameComponentsWithKeys: any[] = [];

          data.entities.edges.forEach((edge) => {
            if (edge && edge.node && edge.node.components) {
              // console.log('edge', edge);
              edge.node.components.forEach((component) => {
                // console.log('component', component);
                if (component && component.__typename === 'Game') {
                  // console.log('component', component);
                  if (edge?.node?.keys && edge?.node?.keys[0]) {
                    gameComponentsWithKeys.push({
                      id: component.game_id,
                      score: component.score,
                      player: edge?.node?.keys[0],
                    });
                  }
                }
              });
            }
          });

          // setGames(gameComponentsWithKeys);
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
      <div className="flex justify-between space p-2 mt-2">
        <LeaderBoardButton onClick={toggleLeaderBoardModal}></LeaderBoardButton>
        <div className="flex justify-center items-center text-8xl text">zKnight</div>
        <CreditsButton onClick={credits}></CreditsButton>
      </div>

      <div className="flex-grow mx-auto mt-2">
        <Canvas />
        <NewGameButton onClick={generateNewGame}></NewGameButton>
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
              <hr className="my-10 border-2" />

              <h2 className="text-black mb-2">Resources Used :</h2>
              <p className="mb-4">
                <a
                  href="https://merchant-shade.itch.io/16x16-puny-characters-plus-sprites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black"
                >
                  Pixel art by Merchant Shade
                </a>
              </p>
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
