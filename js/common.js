let enigma = new Enigma();

$('.rotors-location').val('A');

function msgout(messgae) {
    $('#enigma-msg').text(messgae);
}

msgout('Ready.');

$(document).on('focus', '.rotors-location', function() {
    $(this).select();
});

$(document).on('blur', '.rotors-location', function() {
    $(this).val($(this).val().toUpperCase().substr(0,1));
    if (!/[A-Z]/.test($(this).val())) {
        $(this).val('A');
    }
});

$(document).on('click', '#form-run', function() {
    let rl = [];
    let rlc = '';
    let $rl = $('.rotors-location');
    let input = $('#form-input').val();
    for (let i = 0; i < $rl.length; i++) {
        rlc = $rl.eq(i).val() + rlc;
        rl.push(enigma.toNum($rl.eq(i).val()));
    }

    let output = enigma.translate(input, rl);

    $('#form-output').text(output);
    
    for (let i = 0; i < $rl.length; i++) {
        $rl.eq(i).val(enigma.toChar(enigma.rotorsLocation[i]));
    }

    msgout('Done. Last Rotors Location: ' + rlc);
});