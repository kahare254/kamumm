export const moveAvatar = (avatarType: 'male' | 'female' | 'child', direction: 'forward' | 'backward' | 'left' | 'right') => {
    switch (avatarType) {
        case 'male':
            // Implement male avatar movement logic
            console.log(`Moving male avatar ${direction}`);
            break;
        case 'female':
            // Implement female avatar movement logic
            console.log(`Moving female avatar ${direction}`);
            break;
        case 'child':
            // Implement child avatar movement logic
            console.log(`Moving child avatar ${direction}`);
            break;
        default:
            throw new Error('Invalid avatar type');
    }
};

export const triggerAnimation = (avatarType: 'male' | 'female' | 'child', animation: string) => {
    switch (avatarType) {
        case 'male':
            // Trigger male avatar animation
            console.log(`Triggering ${animation} for male avatar`);
            break;
        case 'female':
            // Trigger female avatar animation
            console.log(`Triggering ${animation} for female avatar`);
            break;
        case 'child':
            // Trigger child avatar animation
            console.log(`Triggering ${animation} for child avatar`);
            break;
        default:
            throw new Error('Invalid avatar type');
    }
};