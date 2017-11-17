import java.util.List;

public class Konto {
	
	private String bezeichnung;
	private List<Kunde> zeichnungsberechtigter;
	
	public GeldBetrag saldo() {
		return new GeldBetrag();
	}
	
	public void einzahlen(GeldBetrag eing_betrag) {
		
	}

}
