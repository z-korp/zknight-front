import { sound } from '@pixi/sound';
import 'font-awesome/css/font-awesome.min.css';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDojo } from './DojoContext';
import Canvas from './ui/Canvas';
import Credits from './ui/Credits';
import CreditsButton from './ui/CreditsButton';
import LeaderBoardButton from './ui/LeaderBoardButton';
import Leaderboard from './ui/Leaderboard';
import { fetchData } from './utils/fetchData';
import { useElementStore } from './utils/store';

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

  const { add_to_leaderboard } = useElementStore((state) => state);

  useEffect(() => {
    if (isMusicPlaying) {
      //sound.play('my-sound');
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

  useEffect(() => {
    sound.add('my-sound', './assets/music.mp3');
  }, []);

  // fetch leaderboard when opening it
  useEffect(() => {
    const fetchAndProcessData = async () => {
      const array = await fetchData(graphSdk);
      array.forEach((e) => add_to_leaderboard(e));
    };

    if (isLeaderBoardModalOpen) {
      fetchAndProcessData();
    }
  }, [isLeaderBoardModalOpen]);

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
          <Credits />
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
          <Leaderboard />
        </div>
      </Modal>
    </div>
  );
}

export default App;
