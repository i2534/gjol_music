package fugue;
/*
import nu.xom.ParsingException;
import org.jfugue.integration.MusicXmlParser;
import org.jfugue.midi.MidiParser;
import org.jfugue.pattern.Pattern;
import org.jfugue.player.Player;
import org.staccato.StaccatoParserListener;

import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.MidiSystem;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;

public class Play {

    public static void main(String[] args) throws InvalidMidiDataException, IOException, ParserConfigurationException, ParsingException {
        StaccatoParserListener listener = new StaccatoParserListener();

        MidiParser parser = new MidiParser();
        parser.addParserListener(listener);
        parser.parse(MidiSystem.getSequence(new File("G:\\notation\\天空之城.mid")));

//        MusicXmlParser mxp = new MusicXmlParser();
//        mxp.addParserListener(listener);
//        mxp.parse(new File("G:\\notation\\两只老虎.musicxml"));

        Pattern staccatoPattern = listener.getPattern();
        System.out.println(staccatoPattern);

        Player player = new Player();
        player.play(staccatoPattern);
    }

}*/
