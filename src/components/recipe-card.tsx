import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Clock, Utensils, ListOrdered } from "lucide-react";

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  duration: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="bg-blue-700 dark:bg-blue-800 text-white p-6">
        <CardTitle className="text-4xl font-bold mb-2">{recipe.title}</CardTitle>
        <div className="flex items-center text-sm">
          <Clock className="mr-1 h-4 w-4" />
          <span>{recipe.duration}</span>
        </div>
      </div>
      <CardContent className="flex flex-col lg:grid md:grid-cols-2 gap-6 p-6">
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 shadow-inner">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-700 dark:text-blue-50">
            <Utensils className="mr-2 h-5 w-5" />
            Ingredientes
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <span className="h-2 w-2 bg-blue-500 rounded-full mr-2" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
            <ListOrdered className="mr-2 h-5 w-5" />
            Instrucciones
          </h3>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="font-bold text-blue-500 mr-2">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}