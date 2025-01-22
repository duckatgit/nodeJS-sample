const generateRandomHexColor = () => {
    // Generate a random light color
    const generateLightColor = () => {
        const r = Math.floor(Math.random() * 128 + 127); // 127-255 range
        const g = Math.floor(Math.random() * 128 + 127); // 127-255 range
        const b = Math.floor(Math.random() * 128 + 127); // 127-255 range
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    // Darken a color by reducing its RGB values
    const darkenColor = (hexColor, factor = 0.7) => {
        const r = Math.floor(parseInt(hexColor.slice(1, 3), 16) * factor);
        const g = Math.floor(parseInt(hexColor.slice(3, 5), 16) * factor);
        const b = Math.floor(parseInt(hexColor.slice(5, 7), 16) * factor);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const lightColor = generateLightColor();
    const darkColor = darkenColor(lightColor);

    return { lightColor, darkColor };
};

module.exports = generateRandomHexColor;