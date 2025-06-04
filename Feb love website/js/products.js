// Product data
const products = [
    {
        id: 1,
        name: "Classic Pearl Strand",
        description: "Timeless elegance with perfectly matched pearls",
        price: 129.99,
        image: "images/classic-pearl.jpg",
        category: "classic",
        featured: true,
        details: "This classic pearl strand features 8-9mm freshwater pearls hand-selected for their luster and matched for size and color. The 18-inch necklace is finished with a secure 14K gold clasp.",
        stock: 15
    },
    {
        id: 2,
        name: "Pearl Pendant",
        description: "Modern design with a stunning central pearl",
        price: 89.99,
        image: "images/pendant-pearl.jpg",
        category: "modern",
        featured: true,
        details: "This contemporary pendant features a 10mm South Sea pearl suspended from a delicate sterling silver chain. The minimalist design highlights the natural beauty of the pearl.",
        stock: 20
    },
    {
        id: 3,
        name: "Multi-Strand Pearl",
        description: "Luxurious multi-strand design for special occasions",
        price: 199.99,
        image: "images/multi-strand.jpg",
        category: "bridal",
        featured: true,
        details: "This stunning three-strand pearl necklace features graduated 6-8mm freshwater pearls. Perfect for weddings and formal events, it's finished with an ornate sterling silver clasp.",
        stock: 8
    },
    {
        id: 4,
        name: "Pearl Choker",
        description: "Modern take on a classic style",
        price: 79.99,
        image: "images/pearl-choker.jpg",
        category: "modern",
        featured: false,
        details: "This contemporary choker features 7mm freshwater pearls spaced along a comfortable velvet band. Adjustable length makes it perfect for any neckline.",
        stock: 12
    },
    {
        id: 5,
        name: "Baroque Pearl Necklace",
        description: "Unique, organic shapes for a distinctive look",
        price: 149.99,
        image: "images/baroque-pearl.jpg",
        category: "modern",
        featured: false,
        details: "Celebrate the unique beauty of baroque pearls with this one-of-a-kind necklace. Each pearl features its own organic shape and character, strung on a 20-inch 14K gold chain.",
        stock: 7
    },
    {
        id: 6,
        name: "Pearl and Diamond Pendant",
        description: "Elegant pearl accented with diamonds",
        price: 249.99,
        image: "images/pearl-diamond.jpg",
        category: "bridal",
        featured: false,
        details: "This luxurious pendant features a 9mm Akoya pearl suspended from a diamond-encrusted bail. The 18-inch chain is crafted from 14K white gold.",
        stock: 5
    },
    {
        id: 7,
        name: "Tin Cup Pearl Necklace",
        description: "Pearls spaced along a delicate chain",
        price: 119.99,
        image: "images/tin-cup.jpg",
        category: "classic",
        featured: false,
        details: "This elegant tin cup style necklace features 7mm freshwater pearls stationed along a delicate 18-inch sterling silver chain. A versatile addition to any jewelry collection.",
        stock: 10
    },
    {
        id: 8,
        name: "Black Pearl Necklace",
        description: "Dramatic Tahitian pearls with incredible luster",
        price: 299.99,
        image: "images/black-pearl.jpg",
        category: "modern",
        featured: false,
        details: "These rare Tahitian black pearls feature incredible peacock overtones. The 9-10mm pearls are strung on an 18-inch necklace with a secure 14K white gold clasp.",
        stock: 3
    },
    {
        id: 9,
        name: "Bridal Pearl Set",
        description: "Complete set for your special day",
        price: 349.99,
        image: "images/bridal-set.jpg",
        category: "bridal",
        featured: false,
        details: "This complete bridal set includes a matching necklace, bracelet, and earrings featuring 7-8mm freshwater pearls. Perfect for your wedding day and beyond.",
        stock: 6
    }
];

// Export the products array for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products };
}