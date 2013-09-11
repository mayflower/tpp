<?php

namespace Mayflower\TPPFrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $kernel = $this->get('kernel');

        if ($kernel->getEnvironment() == "dev" || $kernel->getEnvironment() == "test") {
            $path = $kernel->locateResource('@MayflowerTPPFrontendBundle/Resources/public/app/index.html');
        } else {
            $path = $kernel->locateResource('@MayflowerTPPFrontendBundle/Resources/public/dist/index.html');
        }

        return new BinaryFileResponse($path);
    }
}
