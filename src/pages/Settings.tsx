import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Volume2, VolumeX, Globe } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    toast.success(checked ? "Soundeffekte aktiviert" : "Soundeffekte deaktiviert");
  };

  const handleMusicToggle = (checked: boolean) => {
    setMusicEnabled(checked);
    toast.success(checked ? "Musik aktiviert" : "Musik deaktiviert");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="icon"
            className="hover:bg-muted/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold">Einstellungen</h1>
        </div>

        <div className="space-y-6 slide-up">
          {/* Audio settings */}
          <section className="bg-card border border-border/50 rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
              {soundEnabled || musicEnabled ? (
                <Volume2 className="w-7 h-7" />
              ) : (
                <VolumeX className="w-7 h-7" />
              )}
              Audio
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Soundeffekte</p>
                  <p className="text-sm text-muted-foreground">
                    Aktiviere Sound-Feedback für Aktionen
                  </p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={handleSoundToggle}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Hintergrundmusik</p>
                  <p className="text-sm text-muted-foreground">
                    Spiele Musik während des Spiels
                  </p>
                </div>
                <Switch
                  checked={musicEnabled}
                  onCheckedChange={handleMusicToggle}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </section>

          {/* Language settings */}
          <section className="bg-card border border-border/50 rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
              <Globe className="w-7 h-7" />
              Sprache
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Deutsch</p>
                  <p className="text-sm text-muted-foreground">Aktuelle Sprache</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  Aktiv
                </span>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 opacity-50">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">English</p>
                  <p className="text-sm text-muted-foreground">Coming soon</p>
                </div>
              </div>
            </div>
          </section>

          {/* App info */}
          <section className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-primary">App-Information</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Version:</strong> 1.0.0</p>
              <p><strong className="text-foreground">Entwickelt für:</strong> Android & iOS</p>
              <p className="pt-2 text-xs">
                © 2025 Schnapsidee • Schluck mal! • Alle Rechte vorbehalten
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
