<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Repository\CalendarRepository;
use App\Service\Formatdate;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/calendar', name: 'app_calendar_index')]
    public function index(CalendarRepository $calendarRepository, Formatdate $formatdateService): Response
    {
        $calendars = $calendarRepository->findAll();



        setlocale(LC_TIME, 'fr_FR');

        // Formate les dates avec le service Formatdate
        foreach ($calendars as $calendar) {
            $calendar->formattedStartDate = $formatdateService->formatCustomDate($calendar->getStart());
            $calendar->formattedEndDate = $formatdateService->formatCustomDate($calendar->getEnd());
        }




        return $this->render('calendar/index.html.twig', [
            'calendars' => $calendars,


        ]);
    }

}
