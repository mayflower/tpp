<?php

namespace Mayflower\TPPFrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TestController extends Controller
{
    public function indexAction()
    {
        $kernel = $this->get('kernel');

        if ($kernel->getEnvironment() == "dev") {
            $path = $kernel->locateResource('@MayflowerTPPFrontendBundle/Resources/public/app/index_e2e.html');
        } else {
            $path = $kernel->locateResource('@MayflowerTPPFrontendBundle/Resources/public/dist/index_e2e.html');
        }

        return new BinaryFileResponse($path);
    }
}
