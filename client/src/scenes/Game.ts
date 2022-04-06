import Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  _client = new Colyseus.Client('ws://localhost:2567');
  _selectedButton: Phaser.GameObjects.Image | null = null;

  preload() {
    this.load.image('play', 'assets/play-button.png');
    this.load.image('home', 'assets/home-button.png');
    this.load.image('music', 'assets/music-button.png');
  }

  create() {
    this.createPlay();
    this.createRoomButtons();
  }

  createPlay() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    const play = this.add.image(centerX, centerY, 'play')
      .setScale(0.3)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => play.setTint(0x00ff00))
      .on('pointerout', () => play.setTint())
      .on('pointerup', () => this.handlePlay());
  }

  createRoomButtons() {
    const centerX = this.cameras.main.centerX;
    const home = this.add.image(centerX - 40, 180, 'home')
      .setScale(0.3)
      .setName("home")
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.handleButtonOver(home))
      .on('pointerout', () => this.handleButtonOut(home))
      .on('pointerup', () => this.handleButtonUp(home));
    const music = this.add.image(centerX + 40, 180, 'music')
      .setScale(0.3)
      .setName("music")
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.handleButtonOver(music))
      .on('pointerout', () => this.handleButtonOut(music))
      .on('pointerup', () => this.handleButtonUp(music));
  }

  handleButtonOver(button: Phaser.GameObjects.Image) {
    if (!this._selectedButton || this._selectedButton.name !== button.name) {
      button.setTint(0x00ff00);
    }
  }

  handleButtonUp(button: Phaser.GameObjects.Image) {
    if (this._selectedButton) {
      this._selectedButton.setTint();
    }
    this._selectedButton = button;
    this._selectedButton.setTint(0xffff00);
  }

  handleButtonOut(button: Phaser.GameObjects.Image) {
    if (!this._selectedButton || this._selectedButton.name !== button.name) {
      button.setTint();
    }
  }

  handlePlay() {
    if (!this._selectedButton) {
      console.error("Unable to join my_room, please select a room.");
      return;
    }
    const options = {progress: this._selectedButton.name};
    this._client.joinOrCreate("my_room", options).then(room => {
      console.log(room.sessionId, "joined", room.name);
    }).catch(e => {
      console.error(e);
    });
  }
}
