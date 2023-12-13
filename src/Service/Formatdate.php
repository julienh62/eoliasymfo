<?php


namespace App\Service;


use DateTime; // Importez la classe DateTime
use \IntlDateFormatter;

class Formatdate {

// Créez une fonction pour formater la date
    function formatCustomDate($date) {
        $locale = 'fr_FR'; // Locale en français

        if ($date instanceof DateTime) {
            // Si $date est déjà un objet DateTime, pas besoin de le créer à nouveau
            $dateTime = $date;
        } else {
            // Si $date est une chaîne, créez un objet DateTime
            $dateTime = new DateTime($date);
        }

        $formatter = new \IntlDateFormatter($locale, IntlDateFormatter::FULL, IntlDateFormatter::NONE, null, null, 'EEEE d MMMM H\'h\'mm');

        return $formatter->format($dateTime);
    }
}
