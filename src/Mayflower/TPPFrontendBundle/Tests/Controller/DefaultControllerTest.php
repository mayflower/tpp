<?php

namespace Mayflower\TPPFrontendBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $client->request('GET', '/');

        $this->assertTrue(
            200,
            $client->getResponse()->getStatusCode(),
            "Wrong status code for /"
        );
    }
}
