<?php

namespace Mayflower\TPPBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class WeekController extends Controller
{
    /**
     * shows week overview
     *
     * @param int $year The year to be shown, default null shows current
     * @param int $week The week to be shown, default null shows current
     *
     * @return Symfony\Component\HttpFoundation\Response
     */
    public function indexAction($year, $week)
    {
        $today = new \DateTime('today');
        $year = $year ? $year : $today->format('Y');
        $week = $week ? $week : $today->format('W');
        $resources = $this->getDoctrine()
            ->getRepository('MayflowerTPPBundle:Resource')
            ->findAll();
        $selectedDate = new \DateTime($year."W".sprintf('%02d', $week));
        $tasks = $this->getDoctrine()
            ->getRepository('MayflowerTPPBundle:Task')
            ->findByWeek($selectedDate);
        return $this->render(
            'MayflowerTPPBundle:Week:index.html.twig',
            array(
                'selectedDate' => $selectedDate,
                'year' => $year,
                'week' => $week,
                'resources' => $resources,
                'tasks' => $tasks
            )
        );

    }

}
