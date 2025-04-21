
/**
 * A utility function to create matrix-style typing effect.
 * Use this to simulate terminal-like typing animation.
 */
export const typeText = async (
  element: HTMLElement, 
  text: string, 
  speed: number = 50,
  onComplete?: () => void
): Promise<void> => {
  // Clear the element first
  element.textContent = '';
  
  // Type each character with delay
  for (let i = 0; i < text.length; i++) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        element.textContent += text.charAt(i);
        resolve();
      }, speed);
    });
  }
  
  // Call onComplete callback if provided
  if (onComplete) {
    onComplete();
  }
};

/**
 * Play a subtle typing sound effect
 */
export const playTypeSound = () => {
  const audio = new Audio('/sounds/keystroke.mp3');
  audio.volume = 0.2;
  audio.play().catch(err => console.log('Audio play failed:', err));
};

/**
 * Play system sound
 */
export const playSystemSound = (type: 'access' | 'deny' | 'alert') => {
  let soundPath = '';
  
  switch (type) {
    case 'access':
      soundPath = '/sounds/access-granted.mp3';
      break;
    case 'deny':
      soundPath = '/sounds/access-denied.mp3';
      break;
    case 'alert':
      soundPath = '/sounds/alert.mp3';
      break;
  }
  
  if (soundPath) {
    const audio = new Audio(soundPath);
    audio.volume = 0.3;
    audio.play().catch(err => console.log('Audio play failed:', err));
  }
};
