export interface Product {
    id: string;
    title: string;
    description: string;
    image: string;
    basePrice: number;
    currentPrice: number;
    duration: number; 
    startTime?: string; 
    endTime?: string; 
    status: "active" | "upcoming" | "completed" | "past";
    winnerId?: string; 
}
