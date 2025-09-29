import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Settings, AlertTriangle } from "lucide-react";
import logo from "@/assets/logo.svg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Home = () => {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);

  const handleStartGame = () => {
    setShowWarning(true);
  };

  const confirmStart = () => {
    setShowWarning(false);
    navigate("/setup");
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />
        
        <div className="slide-up max-w-lg w-full space-y-8 text-center">
          {/* Logo/Title */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="Schluck mal!" 
                className="w-full max-w-md h-auto pulse-glow"
              />
            </div>
            <p className="text-xl text-muted-foreground">
              Das ultimative Karten-Trinkspiel
            </p>
          </div>

          {/* Menu buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleStartGame}
              size="lg"
              className="w-full h-16 text-lg bg-gradient-to-r from-primary to-secondary hover:shadow-[var(--shadow-button)] transition-all duration-300 hover:scale-105"
            >
              <Play className="w-6 h-6 mr-3" />
              Spiel starten
            </Button>

            <Button
              onClick={() => navigate("/rules")}
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              <BookOpen className="w-5 h-5 mr-3" />
              Regeln
            </Button>

            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              size="lg"
              className="w-full h-14 text-lg border-secondary/50 hover:bg-secondary/10 hover:border-secondary transition-all duration-300"
            >
              <Settings className="w-5 h-5 mr-3" />
              Einstellungen
            </Button>
          </div>

          {/* Footer */}
          <p className="text-sm text-muted-foreground pt-8">
            Version 1.0 • Nur für Erwachsene
          </p>
        </div>
      </div>

      {/* Age warning dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent className="bg-card border-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-2xl">
              <AlertTriangle className="w-8 h-8 text-primary" />
              Altersverifizierung
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground/80 pt-4">
              <strong>Wichtiger Hinweis:</strong>
              <br /><br />
              Dieses Spiel ist ausschließlich für Personen ab 18 Jahren konzipiert und enthält Inhalte, die den Konsum von Alkohol zum Thema haben.
              <br /><br />
              Bitte spielt verantwortungsvoll und achtet auf euch und eure Mitspieler. Trinkt niemals über eure Grenzen hinaus und fahrt nicht unter Alkoholeinfluss.
              <br /><br />
              Bestätige, dass du mindestens 18 Jahre alt bist und das Spiel verantwortungsvoll spielen wirst.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="border-destructive/50 hover:bg-destructive/10">
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStart}
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-[var(--shadow-button)]"
            >
              Ich bin 18+ und bestätige
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Home;
